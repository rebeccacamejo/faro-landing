import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/app/components/Navbar";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isEs = locale === "es";
  return {
    title: isEs ? "Privacidad — Faro" : "Privacy — Faro",
    description: isEs
      ? "Qué datos recopila el píxel de Faro y cómo los protegemos."
      : "What data the Faro pixel collects and how we protect it.",
  };
}

export default function PrivacyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const isEs = locale === "es";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-[#1A2B4A] mb-2">
          {isEs ? "Política de Privacidad del Píxel de Faro" : "Faro Pixel Privacy Policy"}
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          {isEs ? "Actualizado: mayo 2026" : "Last updated: May 2026"}
        </p>

        <Section title={isEs ? "Qué recopilamos" : "What we collect"}>
          <p>
            {isEs
              ? "El píxel de Faro recopila los siguientes datos cuando visitas un sitio web de un cliente:"
              : "The Faro pixel collects the following data when you visit a client's website:"}
          </p>
          <ul>
            <li>
              <strong>{isEs ? "URL de referencia" : "Referrer URL"}</strong> —{" "}
              {isEs
                ? "el sitio desde el que llegaste (por ejemplo, chat.openai.com). Esto nos permite detectar si llegaste desde una herramienta de IA."
                : "the site you came from (e.g. chat.openai.com). This lets us detect if you arrived from an AI tool."}
            </li>
            <li>
              <strong>{isEs ? "Agente de usuario" : "User agent"}</strong> —{" "}
              {isEs
                ? "el identificador de tu navegador o rastreador. Detecta rastreadores de IA como GPTBot o ClaudeBot."
                : "your browser or crawler identifier. Detects AI crawlers like GPTBot or ClaudeBot."}
            </li>
            <li>
              <strong>{isEs ? "URL de destino" : "Landing URL"}</strong> —{" "}
              {isEs ? "la página que visitaste en el sitio del cliente." : "the page you visited on the client's site."}
            </li>
            <li>
              <strong>
                {isEs ? "ID de sesión (hash)" : "Session ID (hashed)"}
              </strong>{" "}
              —{" "}
              {isEs
                ? "un identificador temporal de sesión almacenado en sessionStorage. Se convierte en un hash SHA-256 de 32 caracteres antes de ser almacenado. Nunca almacenamos el valor sin procesar."
                : "a temporary session identifier stored in sessionStorage. It is SHA-256 hashed before storage. We never store the raw value."}
            </li>
            <li>
              <strong>{isEs ? "Dirección IP (hash)" : "IP address (hashed)"}</strong>{" "}
              —{" "}
              {isEs
                ? "tu IP de servidor se convierte en un hash SHA-256 antes de ser almacenada. No podemos recuperar tu IP original."
                : "your server-side IP is SHA-256 hashed before storage. We cannot recover your original IP."}
            </li>
            <li>
              <strong>{isEs ? "Eventos de conversión" : "Conversion events"}</strong>{" "}
              —{" "}
              {isEs
                ? "si envías un formulario o haces clic en un enlace de teléfono/correo electrónico en el sitio del cliente, registramos el tipo de evento (sin el contenido del formulario ni datos personales)."
                : "if you submit a form or click a phone/email link on the client's site, we record the event type (not form content or personal details)."}
            </li>
          </ul>
        </Section>

        <Section title={isEs ? "Qué NO recopilamos" : "What we do NOT collect"}>
          <ul>
            <li>{isEs ? "Nombre, correo electrónico ni número de teléfono" : "Name, email address, or phone number"}</li>
            <li>{isEs ? "Contenido del formulario" : "Form content"}</li>
            <li>{isEs ? "Cookies ni seguimiento entre sitios" : "Cookies or cross-site tracking"}</li>
            <li>{isEs ? "Datos de pago" : "Payment data"}</li>
            <li>
              {isEs
                ? "Cualquier dato cuando DNT (Do Not Track) está activado en tu navegador"
                : "Any data when Do Not Track (DNT) is enabled in your browser"}
            </li>
          </ul>
        </Section>

        <Section title={isEs ? "Retención de datos" : "Data retention"}>
          <p>
            {isEs
              ? "Los registros de visitas individuales se eliminan después de 90 días. Después de ese período, solo conservamos datos agregados (totales, no datos de visitas individuales). Los datos agregados no contienen información personal."
              : "Individual visit records are deleted after 90 days. After that period we retain only aggregated counts — no individual visit data. Aggregated data contains no personal information."}
          </p>
        </Section>

        <Section title={isEs ? "Cómo usamos los datos" : "How we use this data"}>
          <p>
            {isEs
              ? "Los datos de atribución del píxel se utilizan exclusivamente para:"
              : "Pixel attribution data is used exclusively to:"}
          </p>
          <ul>
            <li>
              {isEs
                ? "Mostrar a los clientes de Faro cuántas visitas provienen de herramientas de IA como ChatGPT, Perplexity o Claude."
                : "Show Faro clients how many visits come from AI tools like ChatGPT, Perplexity, or Claude."}
            </li>
            <li>
              {isEs
                ? "Calcular la tasa de conversión del tráfico referido por IA."
                : "Calculate the conversion rate of AI-referred traffic."}
            </li>
            <li>
              {isEs
                ? "Incluir una sección de 'Tráfico de IA' en los informes mensuales de los clientes."
                : "Populate the 'AI Traffic' section of monthly client reports."}
            </li>
          </ul>
          <p>
            {isEs
              ? "No vendemos, compartimos ni usamos estos datos para publicidad."
              : "We do not sell, share, or use this data for advertising purposes."}
          </p>
        </Section>

        <Section title={isEs ? "Tu privacidad" : "Your privacy"}>
          <p>
            {isEs
              ? "Si tu navegador tiene activado Do Not Track (DNT), el píxel no recopila ningún dato. También puedes instalar un bloqueador de rastreadores como uBlock Origin para bloquear el píxel."
              : "If your browser has Do Not Track (DNT) enabled, the pixel collects no data at all. You can also install a tracker blocker like uBlock Origin to block the pixel."}
          </p>
          <p>
            {isEs
              ? "Para preguntas sobre privacidad, escríbenos a: "
              : "For privacy questions, email us at: "}
            <a href="mailto:privacy@faro.com" className="text-[#1A2B4A] underline">
              privacy@faro.com
            </a>
          </p>
        </Section>

        <Section title={isEs ? "Instalación del píxel" : "Pixel installation"}>
          <p>
            {isEs
              ? "Los clientes de Faro instalan el píxel añadiendo la siguiente etiqueta en sus sitios web:"
              : "Faro clients install the pixel by adding this tag to their websites:"}
          </p>
          <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto text-gray-700">
            {`<script async src="https://cdn.faro.com/pixel.js"\n  data-client-id="YOUR_CLIENT_ID">\n</script>`}
          </pre>
          <p>
            {isEs
              ? "El script está alojado en cdn.faro.com y tiene menos de 5 KB. El código fuente está disponible para revisión pública."
              : "The script is hosted at cdn.faro.com and is under 5 KB. The source code is available for public review."}
          </p>
        </Section>
      </main>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-[#1A2B4A] mb-3">{title}</h2>
      <div className="text-gray-600 space-y-3 leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
        {children}
      </div>
    </section>
  );
}
