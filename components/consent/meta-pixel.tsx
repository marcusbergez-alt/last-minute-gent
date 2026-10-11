"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

type Props = { pixelId: string | undefined };

export function MetaPixel({ pixelId }: Props) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!pixelId) return;
    const check = () => {
      const v = localStorage.getItem("lmg_consent_v1");
      setEnabled(v === "accepted");
    };
    check();
    const onConsent = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      setEnabled(value === "accepted");
    };
    window.addEventListener("lmg:consent", onConsent);
    return () => window.removeEventListener("lmg:consent", onConsent);
  }, [pixelId]);

  if (!pixelId || !enabled) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      {/* noscript fallback voor pixel-tracking */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
