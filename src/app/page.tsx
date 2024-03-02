import Image from "next/image";
import Body from "./home/components/Body";
import Pricing from "./home/components/Pricing";
import Faq from "./home/components/Faq";

export default function Home() {
  return (
    <>
      <Body />
      <Pricing />
      <Faq />
    </>
  );
}
