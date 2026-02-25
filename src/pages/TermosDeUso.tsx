import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import templumLogo from "@/assets/templum-logo.png";

const TermosDeUso = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b border-black/10 px-5 py-4 lg:px-16">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-black/60 hover:text-black transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <img src={templumLogo} alt="Templum" className="h-6" />
        </div>
      </header>

      {/* Content */}
      <main className="px-5 py-10 lg:py-16 lg:px-16">
        <div className="max-w-4xl mx-auto prose prose-sm lg:prose-base">
          <h1 className="text-2xl lg:text-4xl font-extrabold text-black mb-2">Termos de Uso</h1>
          <p className="text-black/40 text-sm mb-8">Última atualização: 25 de fevereiro de 2026</p>

          <p className="text-black/70">
            Bem-vindo ao site da <strong className="text-black">Templum Consultoria</strong>. Ao acessar e utilizar nosso site e serviços, você concorda com os termos e condições descritos abaixo. Leia atentamente antes de prosseguir.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-black mt-8">1. Sobre a Templum</h2>
          <p className="text-black/70">
            A Templum é uma empresa especializada em consultoria para implementação de sistemas de gestão e certificações, incluindo ISO 9001, ISO 14001, ISO 45001 e outras normas. Atuamos em todo o território nacional, auxiliando empresas a estruturarem seus processos e alcançarem a certificação desejada.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-black mt-8">2. Uso do Site</h2>
          <p className="text-black/70">Ao utilizar nosso site, você se compromete a:</p>
          <ul className="text-black/70 space-y-1">
            <li>Fornecer informações verdadeiras, precisas e atualizadas em formulários e cadastros;</li>
            <li>Não utilizar o site para fins ilícitos, fraudulentos ou que violem direitos de terceiros;</li>
            <li>Não reproduzir, distribuir ou modificar qualquer conteúdo do site sem autorização prévia;</li>
            <li>Não tentar acessar áreas restritas, sistemas ou servidores sem autorização.</li>
          </ul>

          <h2 className="text-lg lg:text-xl font-bold text-black mt-8">3. Diagnóstico e Ferramentas Online</h2>
          <p className="text-black/70">
            O diagnóstico de maturidade e demais ferramentas disponibilizadas neste site têm caráter informativo e orientativo. Os resultados são baseados nas informações fornecidas pelo usuário e não substituem uma consultoria técnica completa. A Templum não garante resultados específicos com base exclusivamente no diagnóstico online.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-black mt-8">4. Propriedade Intelectual</h2>
          <p className="text-black/70">
            Todo o conteúdo deste site — incluindo textos, imagens, logotipos, gráficos, vídeos, metodologias e materiais — é de propriedade da Templum Consultoria ou de seus licenciadores, protegido pela legislação brasileira de direitos autorais e propriedade intelectual. É proibida a reprodução, total ou parcial, sem autorização expressa.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-black mt-8">5. Serviços de Consultoria</h2>
          <p className="text-black/70">
            A contratação de serviços de consultoria será formalizada por meio de contrato específico, com escopo, prazos, valores e condições definidos entre as partes. Os presentes Termos de Uso não constituem, por si só, uma proposta comercial ou contrato de prestação de serviços.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-black mt-8">6. Garantia de Certificação</h2>
          <p className="text-black/70">
            A Templum oferece a "Garantia 200%" conforme condições estabelecidas em contrato. A garantia está condicionada ao cumprimento, por parte do cliente, de todas as etapas e requisitos previstos na metodologia de implementação. Os detalhes completos da garantia são formalizados no contrato de prestação de serviços.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-black mt-8">7. Limitação de Responsabilidade</h2>
          <p className="text-black/70">
            A Templum não se responsabiliza por:
          </p>
          <ul className="text-black/70 space-y-1">
            <li>Danos decorrentes do uso inadequado do site ou de suas ferramentas;</li>
            <li>Interrupções temporárias no acesso ao site por motivos técnicos ou de manutenção;</li>
            <li>Conteúdo de sites de terceiros acessados por meio de links disponibilizados em nosso site;</li>
            <li>Decisões tomadas com base exclusivamente nos resultados do diagnóstico online.</li>
          </ul>

          <h2 className="text-lg lg:text-xl font-bold text-black mt-8">8. Comunicações</h2>
          <p className="text-black/70">
            Ao fornecer seus dados de contato, você poderá receber comunicações da Templum, incluindo e-mails informativos, newsletters e ofertas de serviços. Você pode cancelar o recebimento a qualquer momento por meio do link de descadastramento presente nos e-mails ou entrando em contato conosco.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-black mt-8">9. Alterações nos Termos</h2>
          <p className="text-black/70">
            A Templum reserva-se o direito de modificar estes Termos de Uso a qualquer momento, sem aviso prévio. As alterações entram em vigor na data de sua publicação nesta página. Recomendamos que você consulte esta página periodicamente.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-black mt-8">10. Legislação Aplicável</h2>
          <p className="text-black/70">
            Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Eventuais disputas serão submetidas ao foro da comarca de Campinas/SP, com exclusão de qualquer outro, por mais privilegiado que seja.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-black mt-8">11. Contato</h2>
          <p className="text-black/70">
            Em caso de dúvidas sobre estes Termos de Uso, entre em contato:
          </p>
          <div className="bg-black/5 border border-black/10 rounded-xl p-4 text-black/70 text-sm space-y-1 mt-3">
            <p><strong className="text-black/90">Templum Consultoria</strong></p>
            <p>E-mail: <a href="mailto:contato@templum.com.br" className="text-primary hover:underline">contato@templum.com.br</a></p>
            <p>Site: <a href="https://templum.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">templum.com.br</a></p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 px-5 py-6 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-black/40">© 2026 Templum. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermosDeUso;
