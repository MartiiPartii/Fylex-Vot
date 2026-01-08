package com.nefara.TextFormatter;

import java.text.BreakIterator;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class TextFormatter {

    public static String convertToNumberedList(String text) {
        if (text == null || text.isEmpty())
            return "";

        text = text.replaceAll("\\r\\n|\\r", "\n").replaceAll("[ \\t]+", " ");

        String[] lines = text.split("\n");

        List<String> items = new ArrayList<>();
        StringBuilder buffer = new StringBuilder();

        for (String line : lines) {
            line = line.trim();

            if (line.isEmpty()) {
                if (buffer.length() > 0) {
                    addSentences(buffer.toString(), items);
                    buffer.setLength(0);
                }

            } else {
                if (buffer.length() > 0)
                    buffer.append(" ");
                buffer.append(line);
            }
        }

        if (buffer.length() > 0) {
            addSentences(buffer.toString(), items);
        }

        StringBuilder result = new StringBuilder();
        int counter = 1;
        for (String item : items) {
            if (!item.isBlank()) {
                result.append(counter++).append(". ").append(item).append("\n");
            }
        }

        return result.toString();
    }

    private static void addSentences(String text, List<String> items) {

        BreakIterator iterator = BreakIterator.getSentenceInstance(Locale.ROOT);
        iterator.setText(text);

        int start = iterator.first();
        for (int end = iterator.next(); end != BreakIterator.DONE; start = end, end = iterator.next()) {
            String sentence = text.substring(start, end).trim();
            if (!sentence.isEmpty()) {
                items.add(sentence);
            }
        }
    }

}
