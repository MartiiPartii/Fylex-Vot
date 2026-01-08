import AuthForm from "~/components/AuthForm/AuthForm"
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper"
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { registerAction } from "~/actions/auth";

export const metadata = {
    title: "Register | Fylex",
    description: "Get started with your free Fylex account.",

    twitter: {
        card: "summary_large_image",
        title: "Register to Fylex",
        description: "Get started with your free Fylex account.",
        images: ['https://fylex-client-test.onrender.com/meta/social.png']
    },

    openGraph: {
        title: "Register to Fylex",
        description: "Get started with your free Fylex account.",
        type: "website",
        url: "https://fylex-client-test.onrender.com/",
        images: [{
            url: 'https://fylex-client-test.onrender.com/meta/social.png',
            width: 1200,
            height: 630,
        }]
    },
}

import { FormInput } from "~/types/form";

const Register = () => {
    const inputs: FormInput[] = [
        {
            label: "Email Address",
            placeholder: "Enter your email",
            name: "email",
            type: "email",
            Icon: MailOutlineIcon
        },
        {
            label: "First Name",
            placeholder: "Enter your first name",
            name: "firstName",
            type: "text",
            Icon: PersonOutlineOutlinedIcon
        },
        {
            label: "Last Name",
            placeholder: "Enter your last name",
            name: "lastName",
            type: "text",
            Icon: PersonOutlineOutlinedIcon
        },
        {
            label: "Password",
            placeholder: "Create a strong password",
            name: "password",
            type: "password",
            Icon: LockOutlinedIcon
        }
    ]



    return (
        <SectionWrapper props={{ sx: { paddingTop: 8, paddingBottom: 8 } }}>
            <AuthForm
                title="Create Account"
                description="Get started with your free Fylex account."
                inputs={inputs}
                buttonLabel="Create Account 🎉"
                handleSubmit={registerAction}
                link={{
                    text: "Already have an account?",
                    label: "Sign in here",
                    to: "/login"
                }}
            />
        </SectionWrapper>
    )
}

export default Register