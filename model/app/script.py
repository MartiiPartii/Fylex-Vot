import os
from dotenv import load_dotenv
from openai import OpenAI
import time
import json

load_dotenv()

def load_config():
    
  client = OpenAI(
      base_url=os.environ["BASE_URL_HUGINGFACE"],
      api_key=os.environ["HF_TOKEN"],
    )
  prompt = f"""

      You are a multilingual fraud detection system specialized in analyzing official documents, contracts, emails, and communications.

      Your task:
      - Analyze the provided text as a whole.
      - Identify ONLY sentences or elements that **pose an actual risk to the reader**, such as instructions, requests, links, or phrases that could be exploited for fraud. Consider the context carefully: not every instruction, request, name, or email is malicious.
      - Additionally, analyze metadata or contextual clues in the text, such as:
        - Personal names or titles
        - Occupations
        - Email addresses and domains
        - Company names
      - Flag these elements **only if they appear suspicious or associated with risky context**, such as:
        - Unusual or unrecognized domains in email addresses or links
        - Fake or misleading company names
        - Titles or names that could be used for impersonation
      - Do NOT flag harmless phone numbers, addresses, or names in normal context.

      For each risky sentence or element, return a JSON object with the following fields:
      - "line": the line number from the input
      - "risk_level": one of ["high", "medium", "low"], indicating the potential severity
      - "sentence": the exact sentence text (unchanged) or the element text
      - "type": one of ["Phishing", "Lottery Scam", "Financial Manipulation", "Impersonation", "Other Fraud"]
      - "explanation": a brief, human-readable explanation of why this sentence or element could be risky to the recipient

      Output requirements:
      - Return a JSON array of objects.
      - If no sentences or elements are risky, return an empty JSON array (`[]`).
      - Do not include any extra text, commentary, or explanations outside the JSON array.
      - Preserve the line numbers exactly as provided in the input.

    """
  
  return client, prompt

def return_analysis(text: str, prompt_template: str, client):
    
    def calculate_total_risk(risks):
        weights = {"low": 1, "medium": 2, "high": 3}

        if not risks:
            return 100, "Low"  

        total_score = sum(weights[r["risk_level"].lower()] for r in risks if "risk_level" in r and r["risk_level"].lower() in weights)
        max_score = len(risks) * weights["high"]
        
        if max_score == 0:
             return 100, "Low"

        percentage = (1 - total_score / max_score) * 100

        counts = {"low": 0, "medium": 0, "high": 0}
        for r in risks:
            lvl = r.get("risk_level", "low").lower()
            if lvl in counts:
                counts[lvl] += 1

        high_ratio = counts["high"] / len(risks)
        medium_ratio = counts["medium"] / len(risks)

        adjustment_factor = 1 - (0.5 * high_ratio + 0.25 * medium_ratio)
        percentage *= adjustment_factor

        if percentage < 40:
            overall = "High"
        elif percentage < 80:
            overall = "Medium"
        else:
            overall = "Low"

        return percentage, overall

    prompt = f"{prompt_template} \n Text to analyize: \n {text}"
    start_time = time.time()
    
    analysis = []
    
    try:
        completion = client.chat.completions.create(
          model="llama-3.3-70b-versatile",
          messages=[
              {"role": "system", "content": "You are a helpful fraud detection assistant."},
              {"role": "user", "content": prompt}
          ],
          temperature=0,
        )
        
        if completion.choices:
            analysis_text = completion.choices[0].message.content
            # Attempt to extract JSON
            try:
                start_idx = analysis_text.find('[')
                end_idx = analysis_text.rfind(']')
                if start_idx != -1 and end_idx != -1:
                    json_str = analysis_text[start_idx:end_idx+1]
                    analysis = json.loads(json_str)
                else:
                    print(f"Warning: No JSON array found in response.")
            except json.JSONDecodeError:
                print(f"Error parsing JSON from response.")
                
    except Exception as e:
        print(f"Error calling model: {e}")
        # Re-raise so the API endpoint returns a 500 or 400 error
        raise e

    end_time = time.time()
    total_time = end_time - start_time

    percentage, overall = calculate_total_risk(analysis)
    
    return {
     "analysis":  analysis,
     "percentage": percentage,
     "overall": overall,
     "time": f"{total_time:.2f} seconds"
    }





if __name__ == "__main__":
   client, prompt = load_config()
   scam_text = "Dear Valued Client,\nWe are pleased to inform you that your account has been pre-approved for an exclusive\nfinancial windfall. You are among the lucky few to receive access to this\nonce-in-a-lifetime opportunity. Our investors have achieved incredible returns, and now\nit’s your turn to profit, starting today.\nFor a limited time only, we are offering you the chance to invest a small initial amount\nthat guarantees you returns of up to 500% in just 7 days. This is a high-return\nopportunity, but don’t wait – the window will close in 48 hours!\nTo take part, you must follow these simple steps:\nDeposit $500 into our secure account using the details provided.\nProvide your personal details and bank account information to ensure your\nreturns are credited properly.\nWait for your funds to grow exponentially.\nThis is a unique opportunity that has been tailored just for you. Only a handful of clients\nwill be allowed to take advantage of this, and once it’s gone, it’s gone for good.\nAct now to secure your future wealth!\nBest regards,\nRobert Johnson\nFinancial Consultant\nWealth Strategies Group\nPhone: (888) 456-7890\nEmail: r.johnson@wealthstrategiesgroup.com"

   print(return_analysis(scam_text, prompt, client))