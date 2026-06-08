"use client";

import { useState } from "react";
import { AiFillFileText, AiOutlineLeft, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsPeopleFill } from "react-icons/bs";
import { GiFlowerPot } from "react-icons/gi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer"

const faqs = [
  {
    question: "How does the free 7-day trial work?",
    answer:
      "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial.",
  },
  {
    question: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    answer:
      "While an annual plan is active, it is not feasible to switch to a monthly plan. However, once the current month ends, transitioning from a monthly plan to an annual plan is an option.",
  },
  {
    question: "What's included in the Premium plan?",
    answer:
      "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle.",
  },
  {
    question: "Can I cancel during my trial or subscription?",
    answer:
      "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day.",
  },
];

export default function ChoosePlanPage() {
  const [selectedPlan, setSelectedPlan] = useState<"yearly" | "monthly">("yearly");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const { uid } = useSelector((state: RootState) => state.user);
const router = useRouter();

const handleSubscribe = async () => {
  if (!uid) {
    router.push("/");
    return;
  }
  setLoading(true);

  try {
    const docRef = await addDoc(
      collection(db, "customers", uid, "checkout_sessions"),
      {
        price: selectedPlan === "yearly"
          ? "price_1Tg3Z2ClkxGgWDmuUesrqxza"
          : "price_1Tg3aGClkxGgWDmu3vt3bcwt",
        success_url: `${window.location.origin}/for-you`,
        cancel_url: `${window.location.origin}/choose-plan`,
        trial_period_days: selectedPlan === "yearly" ? 7 : 0,
      }
    );

    onSnapshot(docRef, (snap) => {
      const data = snap.data();
      if (data?.url) {
        window.location.assign(data.url);
      }
      if (data?.error) {
        console.error("Stripe error:", data.error);
        setLoading(false);
      }
    });
  } catch (err) {
    console.error("Failed to create checkout session", err);
    setLoading(false);
  }
};

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
    <button className="plan__back--btn" onClick={() => router.back()}>
        <AiOutlineLeft />
        <span>Back</span>
      </button>
    <div className="plan__page">
      
      {/* HERO */}
     <div className="plan__hero">
        <div className="plan__hero--content">
          <h1 className="plan__hero--title">
            Get unlimited access to many amazing books to read
          </h1>
          <p className="plan__hero--subtitle">
            Turn ordinary moments into amazing learning opportunities
          </p>
        </div>
        <div className="plan__hero--img--wrapper">
          <img src="/assets/pricing-top.png" alt="pricing" className="plan__hero--img" />
        </div>
      </div>

      {/* FEATURES */}
      <div className="plan__features--wrapper">
        <div className="plan__feature--item">
          <AiFillFileText className="plan__feature--icon" />
          <p><b>Key ideas in few min</b> with many books to read</p>
        </div>
        <div className="plan__feature--item">
          <GiFlowerPot className="plan__feature--icon" />
          <p><b>3 million</b> people growing with Summarist everyday</p>
        </div>
        <div className="plan__feature--item">
          <BsPeopleFill className="plan__feature--icon" />
          <p><b>Precise recommendations</b> collections curated by experts</p>
        </div>
      </div>

      {/* PLAN SELECTION */}
      <h2 className="plan__select--title">Choose the plan that fits you</h2>

      <div className="plan__select--wrapper">
        <div
          className={`plan__select--card ${selectedPlan === "yearly" ? "plan__select--card-active" : ""}`}
          onClick={() => setSelectedPlan("yearly")}
        >
          <div className="plan__select--radio">
            {selectedPlan === "yearly" ? "🔵" : "⚪"}
          </div>
          <div>
            <div className="plan__select--name">Premium Plus Yearly</div>
            <div className="plan__select--price">$99.99/year</div>
            <div className="plan__select--trial">7-day free trial included</div>
          </div>
        </div>

        <div className="plan__select--or">
          <hr /><span>or</span><hr />
        </div>

        <div
          className={`plan__select--card ${selectedPlan === "monthly" ? "plan__select--card-active" : ""}`}
          onClick={() => setSelectedPlan("monthly")}
        >
          <div className="plan__select--radio">
            {selectedPlan === "monthly" ? "🔵" : "⚪"}
          </div>
          <div>
            <div className="plan__select--name">Premium Monthly</div>
            <div className="plan__select--price">$9.99/month</div>
            <div className="plan__select--trial">No trial included</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <button className="btn plan__btn" onClick={handleSubscribe} disabled={loading}>
        {loading ? "Please wait..." : selectedPlan === "yearly" ? "Start your free 7-day trial" : "Get started"}
      </button>
      <p className="plan__disclaimer">
        Cancel your trial at any time before it ends, and you won't be charged.
      </p>

      {/* ACCORDION */}
      <div className="plan__accordion">
        {faqs.map((faq, index) => (
          <div key={index} className="plan__accordion--item">
            <button
              className="plan__accordion--question"
              onClick={() => toggleAccordion(index)}
            >
              <span>{faq.question}</span>
              {openIndex === index ? <AiOutlineMinus /> : <AiOutlinePlus />}
            </button>
            {openIndex === index && (
              <div className="plan__accordion--answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <Footer />

    </div>
    </>
  );
}