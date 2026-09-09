import { Link } from 'react-router-dom';

export default function CookiesPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:py-16">
      <h1 className="text-3xl font-extrabold text-brasa-900">Política de Cookies</h1>
      <p className="mt-2 text-sm text-brasa-400">Última actualización: {new Date().getFullYear()}</p>

      <div className="prose-legal mt-8 space-y-6 text-sm leading-relaxed text-brasa-600">
        <section>
          <h2 className="text-lg font-bold text-brasa-800">1. ¿Qué son las cookies?</h2>
          <p className="mt-2">
            Las cookies y tecnologías similares (como el almacenamiento local del navegador) son
            pequeños archivos que un sitio web guarda en tu dispositivo para recordar información
            entre visitas o durante la navegación.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">2. Cookies que utilizamos</h2>
          <p className="mt-2">
            Este sitio web <strong>no utiliza cookies de analítica ni de publicidad</strong>. Solo se
            emplea almacenamiento técnico, estrictamente necesario para el funcionamiento de la
            tienda, que no requiere consentimiento según la normativa vigente:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Carrito de la compra</strong> (localStorage): guarda los productos añadidos al
              carrito en tu navegador para que no se pierdan al cambiar de página.
            </li>
            <li>
              <strong>Sesión de administración</strong> (localStorage, vía Supabase Auth): mantiene
              iniciada la sesión de los gerentes en el panel de administración.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">3. Contenido de terceros</h2>
          <p className="mt-2">
            La página de horario/ubicación puede incluir un mapa incrustado (Google Maps), que es un
            servicio de terceros y puede establecer sus propias cookies conforme a su propia
            política de privacidad, ajena a {' '}
            <Link to="/aviso-legal" className="underline">este sitio web</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">4. Cómo gestionar o eliminar las cookies</h2>
          <p className="mt-2">
            Puedes eliminar el almacenamiento local en cualquier momento desde la configuración de tu
            navegador (habitualmente en "Privacidad" o "Datos de sitios web"). Ten en cuenta que
            borrar el carrito hará que pierdas los productos añadidos.
          </p>
        </section>

        <p className="pt-4 text-xs text-brasa-400">
          Consulta también nuestra{' '}
          <Link to="/politica-de-privacidad" className="underline">Política de Privacidad</Link>.
        </p>
      </div>
    </div>
  );
}
