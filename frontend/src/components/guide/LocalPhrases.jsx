import React, { useState } from "react";
import { Languages, Volume2, Check } from "lucide-react";

export const LocalPhrases = () => {
  const [activeLang, setActiveLang] = useState("hi");

  const phrasesData = {
    hi: {
      langName: "Hindi (हिन्दी)",
      phrases: [
        { en: "Hello / Greetings", local: "नमस्ते (Namaste)", pronunciation: "Nah-mas-tay" },
        { en: "How much does this cost?", local: "यह कितने का है? (Yeh kitne ka hai?)", pronunciation: "Yay kit-nay kah high?" },
        { en: "Where is the nearest medical / hospital?", local: "नज़दीकी अस्पताल कहाँ है? (Nazdeeki aspatal kahan hai?)", pronunciation: "Naz-dee-kee uss-pah-tahl kah-haan high?" },
        { en: "Please help me", local: "कृपया मेरी मदद करें (Kripya meri madad karein)", pronunciation: "Krip-yah may-ree mah-dad kah-rain" },
        { en: "Thank you very much", local: "बहुत बहुत धन्यवाद (Bahut bahut dhanyavaad)", pronunciation: "Bah-hoot dhun-yuh-vaad" },
        { en: "Is this vegetarian / pure veg?", local: "क्या यह शाकाहारी है? (Kya yeh shakahari hai?)", pronunciation: "Kyah yay shah-kah-hah-ree high?" }
      ]
    },
    ta: {
      langName: "Tamil (தமிழ்)",
      phrases: [
        { en: "Hello / Welcome", local: "வணக்கம் (Vanakkam)", pronunciation: "Vah-nuh-kum" },
        { en: "How much does this cost?", local: "இது என்ன விலை? (Idhu enna vilai?)", pronunciation: "Ih-dhu en-nah vi-lye?" },
        { en: "Where is the bus stand / station?", local: "பேருந்து நிலையம் எங்கே உள்ளது? (Perundhu nilayam enge ulladhu?)", pronunciation: "Pay-roon-dhu ni-lah-yum en-gay?" },
        { en: "Please help me", local: "தயவுசெய்து எனக்கு உதவுங்கள் (Dayavu seidhu udhavungal)", pronunciation: "Dhah-yah-voo say-dhoo ood-hah-voon-gull" },
        { en: "Thank you", local: "நன்றி (Nandri)", pronunciation: "Nun-dree" },
        { en: "Delicious food!", local: "சாப்பாடு மிகவும் சுவை! (Saapaadu migavum suvai!)", pronunciation: "Sah-pah-doo mee-gah-voom soo-vye!" }
      ]
    },
    te: {
      langName: "Telugu (తెలుగు)",
      phrases: [
        { en: "Hello / Namaste", local: "నమస్కారం (Namaskaram)", pronunciation: "Nah-mas-kah-rum" },
        { en: "How much is this?", local: "ఇది ఎంత? (Idi entha?)", pronunciation: "Ee-dee en-tah?" },
        { en: "Where is this temple / place?", local: "ఈ గుడి ఎక్కడ ఉంది? (Ee gudi ekkada undi?)", pronunciation: "Ee goo-dee ek-kah-dah oon-dee?" },
        { en: "Please help me", local: "దయచేసి నాకు సహాయం చేయండి (Dayachesi sahayamu cheyandi)", pronunciation: "Dah-yah-chay-see sah-hah-yum chay-yun-dee" },
        { en: "Thank you", local: "ధన్యవాదాలు (Dhanyavadalu)", pronunciation: "Dhun-yah-vah-dah-loo" },
        { en: "Water please", local: "మంచినీళ్లు ఇవ్వండి (Manchineellu ivvandi)", pronunciation: "Mun-chee-neel-loo eev-vun-dee" }
      ]
    }
  };

  const current = phrasesData[activeLang] || phrasesData.hi;

  const handleSpeak = (text) => {
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "24px", borderRadius: "var(--radius-xl)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "18px" }}>
        <div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>Local Language Pocket Phrasebook</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Essential phrases to interact smoothly with locals & drivers</p>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {Object.keys(phrasesData).map((k) => (
            <button
              key={k}
              onClick={() => setActiveLang(k)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-full)",
                border: "1px solid",
                borderColor: activeLang === k ? "var(--brand-ocean)" : "var(--border-subtle)",
                background: activeLang === k ? "var(--brand-ocean)" : "var(--bg-tertiary)",
                color: activeLang === k ? "#fff" : "var(--text-primary)",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer"
              }}
            >
              {phrasesData[k].langName}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
        {current.phrases.map((phrase, idx) => (
          <div
            key={idx}
            style={{
              background: "var(--bg-tertiary)",
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px"
            }}
          >
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>{phrase.en}</div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>{phrase.local}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--brand-primary)", fontStyle: "italic" }}>"{phrase.pronunciation}"</div>
            </div>

            <button
              onClick={() => handleSpeak(phrase.local)}
              className="btn-ghost"
              style={{ padding: "8px", borderRadius: "50%", background: "var(--bg-card-solid)" }}
              title="Listen to pronunciation"
            >
              <Volume2 size={16} color="var(--brand-ocean)" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
