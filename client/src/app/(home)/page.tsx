import About from "~/components/About/About"
import Hero from "~/components/Hero/Hero"
import SectionWrapper from "~/components/SectionWrapper/SectionWrapper"

const Home = () => {
    return (
        <SectionWrapper
            maxWidth="md"
            props={{
                sx: { textAlign: "center" }
            }}
        >
            <Hero />
            <About />
        </SectionWrapper>
    )
}

export default Home