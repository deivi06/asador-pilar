import { Link } from 'react-router-dom';
import { useApp } from '../../state/AppContext';

export default function PrivacyPolicyPage() {
  const { businessInfo } = useApp();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:py-16">
      <h1 className="text-3xl font-extrabold text-brasa-900">Política de Privacidad</h1>
      <p className="mt-2 text-sm text-brasa-400">Última actualización: {new Date().getFullYear()}</p>

      <div className="prose-legal mt-8 space-y-6 text-sm leading-relaxed text-brasa-600">
        <section>
          <h2 className="text-lg font-bold text-brasa-800">1. Responsable del tratamiento</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Nombre comercial:</strong> {businessInfo.name}</li>
            <li><strong>Domicilio:</strong> {businessInfo.address}</li>
            <li><strong>Email de contacto:</strong> info@asadorpilar.com</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">2. Datos que recogemos</h2>
          <p className="mt-2">Recogemos únicamente los datos que el propio usuario nos facilita voluntariamente:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Al hacer un pedido:</strong> nombre, teléfono y, opcionalmente, email.</li>
            <li><strong>Al rellenar el formulario de contacto:</strong> nombre, teléfono y/o email, y el mensaje enviado.</li>
          </ul>
          <p className="mt-2">
            No se recogen datos de pago (el pago se realiza en el establecimiento) ni se utilizan
            cookies de análisis o publicidad.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">3. Finalidad del tratamiento</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Gestionar y preparar el pedido realizado para su recogida en el local.</li>
            <li>Enviar un email de confirmación del pedido (si el cliente indica su email).</li>
            <li>Permitir al cliente consultar o anular su propio pedido posteriormente.</li>
            <li>Responder a las consultas enviadas a través del formulario de contacto.</li>
            <li>Enviar, si el cliente lo inicia, un recordatorio del pedido por WhatsApp.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">4. Legitimación</h2>
          <p className="mt-2">
            La base legal para el tratamiento de los datos es la ejecución de un pedido solicitado
            por el propio usuario (relación precontractual/contractual) y, en el caso del formulario
            de contacto, el consentimiento del usuario al enviarlo.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">5. Conservación de los datos</h2>
          <p className="mt-2">
            Los datos se conservan durante el tiempo necesario para gestionar el pedido o la
            consulta, y posteriormente durante los plazos legalmente exigibles para atender
            eventuales responsabilidades.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">6. Destinatarios y encargados del tratamiento</h2>
          <p className="mt-2">No se ceden datos a terceros salvo obligación legal. Se utilizan los siguientes proveedores como encargados del tratamiento:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Supabase</strong> (alojamiento de la base de datos y autenticación).</li>
            <li><strong>Resend</strong> (envío del email de confirmación de pedido).</li>
          </ul>
          <p className="mt-2">
            El recordatorio por WhatsApp lo inicia el propio cliente desde su dispositivo mediante
            un enlace (wa.me); {businessInfo.name} no comparte automáticamente los datos con WhatsApp.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">7. Derechos de las personas usuarias</h2>
          <p className="mt-2">
            Cualquier usuario puede ejercer sus derechos de acceso, rectificación, supresión,
            oposición, limitación del tratamiento y portabilidad escribiendo a{' '}
            <strong>info@asadorpilar.com</strong>, indicando el derecho que desea ejercer y
            adjuntando copia de un documento identificativo.
          </p>
          <p className="mt-2">
            Si consideras que tus datos no se tratan correctamente, puedes presentar una reclamación
            ante la Agencia Española de Protección de Datos (
            <a href="https://www.aepd.es" target="_blank" rel="noreferrer" className="underline">www.aepd.es</a>
            ).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">8. Seguridad</h2>
          <p className="mt-2">
            Se aplican medidas técnicas y organizativas razonables para proteger los datos personales
            frente a accesos no autorizados, pérdida o alteración, incluyendo control de acceso por
            roles y cifrado en tránsito.
          </p>
        </section>

        <p className="pt-4 text-xs text-brasa-400">
          Consulta también nuestra{' '}
          <Link to="/politica-de-cookies" className="underline">Política de Cookies</Link> y el{' '}
          <Link to="/aviso-legal" className="underline">Aviso Legal</Link>.
        </p>
      </div>
    </div>
  );
}
