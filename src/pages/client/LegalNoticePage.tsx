import { useApp } from '../../state/AppContext';

export default function LegalNoticePage() {
  const { businessInfo } = useApp();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:py-16">
      <h1 className="text-3xl font-extrabold text-brasa-900">Aviso Legal</h1>
      <p className="mt-2 text-sm text-brasa-400">Última actualización: {new Date().getFullYear()}</p>

      <div className="prose-legal mt-8 space-y-6 text-sm leading-relaxed text-brasa-600">
        <section>
          <h2 className="text-lg font-bold text-brasa-800">1. Datos identificativos</h2>
          <p className="mt-2">
            En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la
            Información y de Comercio Electrónico (LSSI-CE), se informa de los siguientes datos:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><strong>Nombre comercial:</strong> {businessInfo.name}</li>
            <li><strong>Domicilio:</strong> {businessInfo.address}</li>
            <li><strong>Teléfono:</strong> {businessInfo.phone}</li>
            <li><strong>Email:</strong> info@asadorpilar.com</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">2. Objeto</h2>
          <p className="mt-2">
            Este sitio web permite a los usuarios consultar la carta de {businessInfo.name} y
            realizar pedidos para recoger en el establecimiento. No se ofrece servicio de reparto
            a domicilio ni se procesan pagos online: el pago se realiza en el momento de la
            recogida.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">3. Condiciones de uso</h2>
          <p className="mt-2">
            El uso de este sitio web atribuye la condición de usuario e implica la aceptación de
            las condiciones incluidas en este Aviso Legal. El usuario se compromete a facilitar
            datos veraces al realizar un pedido o rellenar el formulario de contacto, y a hacer un
            uso lícito del sitio web.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">4. Condiciones de compra y recogida</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>Los pedidos se recogen únicamente en {businessInfo.address}, en el horario indicado en la web.</li>
            <li>El cliente puede consultar y anular su propio pedido desde la sección "Mi Pedido", identificándose con el número de pedido y el teléfono usado al hacerlo.</li>
            <li>Los precios mostrados incluyen impuestos aplicables y están expresados en euros (€).</li>
            <li>La disponibilidad de los platos puede variar según existencias.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">5. Propiedad intelectual</h2>
          <p className="mt-2">
            Los contenidos de este sitio web (textos, imágenes, marca y logotipo) son propiedad de{' '}
            {businessInfo.name} o se utilizan con la debida autorización, quedando prohibida su
            reproducción sin consentimiento previo.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">6. Limitación de responsabilidad</h2>
          <p className="mt-2">
            {businessInfo.name} no se hace responsable de las interrupciones del servicio derivadas
            de causas ajenas a su control, ni de los daños que pudieran derivarse de un uso indebido
            de este sitio web por parte del usuario.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brasa-800">7. Legislación aplicable</h2>
          <p className="mt-2">
            Las presentes condiciones se rigen por la legislación española. Para cualquier
            controversia, las partes se someten a los Juzgados y Tribunales de Murcia, salvo que la
            normativa de consumidores y usuarios establezca otro fuero.
          </p>
        </section>
      </div>
    </div>
  );
}
