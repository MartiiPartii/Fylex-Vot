import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper";
import AuthForm from "~/components/AuthForm/AuthForm";
import { loginAction } from "~/actions/auth";
import { Metadata } from 'next';
import { FormInput } from '~/types/form';

export const metadata: Metadata = {
    title: "Login | Fylex",
    description: "Sign in to your Fylex account to continue protecting your documents.",

    twitter: {
        card: "summary_large_image",
        title: "Login to Fylex",
        description: "Sign in to your Fylex account to continue protecting your documents.",
        images: ['https://fylex-client-test.onrender.com/meta/social.png']
    },

    openGraph: {
        title: "Login to Fylex",
        description: "Sign in to your Fylex account to continue protecting your documents.",
        type: "website",
        url: "https://fylex-client-test.onrender.com/",
        images: [{
            url: 'https://fylex-client-test.onrender.com/meta/social.png',
            width: 1200,
            height: 630,
        }]
    },
}

const Login = () => {
    const inputs: FormInput[] = [
        {
            label: "Email Address",
            placeholder: "Enter your email",
            name: "email",
            type: "email",
            Icon: MailOutlineIcon
        },
        {
            label: "Password",
            placeholder: "Enter your password",
            name: "password",
            type: "password",
            Icon: LockOutlinedIcon
        },
    ]


    return (
        <SectionWrapper props={{ sx: { paddingTop: 8, paddingBottom: 8 } }}>
            <AuthForm
                title="Welcome back! 👋"
                description="Sign in to your Fylex account to continue protecting your documents."
                inputs={inputs}
                buttonLabel="Sign In Securely 🔐"
                handleSubmit={loginAction}
                link={{
                    text: "Don't have an account?",
                    label: "Sign up for free",
                    to: "/register"
                }}
            />
        </SectionWrapper>
    )
}

export default Login