import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import templumLogo from "@/assets/templum-logo-white.png";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-white/10 px-5 py-4 lg:px-16">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <img src={templumLogo} alt="Templum" className="h-6" />
        </div>
      </header>

      {/* Content */}
      <main className="px-5 py-10 lg:py-16 lg:px-16">
        <div className="max-w-4xl mx-auto prose prose-invert prose-sm lg:prose-base">
          <h1 className="text-2xl lg:text-4xl font-extrabold text-white mb-2">Política de Privacidade</h1>
          <p className="text-white/40 text-sm mb-8">Última atualização: 25 de fevereiro de 2026</p>

          <p className="text-white/70">
            A <strong className="text-white">Templum Consultoria</strong> ("Templum", "nós", "nosso") tem o compromisso de proteger a privacidade e os dados pessoais de seus clientes, parceiros e visitantes. Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-white mt-8">1. Dados Coletados</h2>
          <p className="text-white/70">Podemos coletar os seguintes dados pessoais:</p>
          <ul className="text-white/70 space-y-1">
            <li><strong className="text-white/90">Dados de identificação:</strong> nome completo, CPF/CNPJ, cargo e empresa.</li>
            <li><strong className="text-white/90">Dados de contato:</strong> e-mail, telefone e endereço.</li>
            <li><strong className="text-white/90">Dados de navegação:</strong> endereço IP, cookies, páginas acessadas, tempo de permanência e dispositivo utilizado.</li>
            <li><strong className="text-white/90">Dados fornecidos voluntariamente:</strong> informações inseridas em formulários, diagnósticos, pesquisas ou comunicações diretas.</li>
          </ul>

          <h2 className="text-lg lg:text-xl font-bold text-white mt-8">2. Finalidade do Tratamento</h2>
          <p className="text-white/70">Utilizamos seus dados para as seguintes finalidades:</p>
          <ul className="text-white/70 space-y-1">
            <li>Prestação de serviços de consultoria e implementação de sistemas de gestão;</li>
            <li>Envio de diagnósticos, relatórios e materiais personalizados;</li>
            <li>Comunicações comerciais, incluindo ofertas, newsletters e novidades (com consentimento);</li>
            <li>Atendimento a solicitações e suporte ao cliente;</li>
            <li>Cumprimento de obrigações legais e regulatórias;</li>
            <li>Melhoria contínua de nossos produtos, serviços e experiência do usuário;</li>
            <li>Análises estatísticas e de desempenho (de forma anonimizada quando possível).</li>
          </ul>

          <h2 className="text-lg lg:text-xl font-bold text-white mt-8">3. Base Legal</h2>
          <p className="text-white/70">
            O tratamento de seus dados pessoais é realizado com base nas seguintes hipóteses legais previstas na LGPD: consentimento do titular; execução de contrato ou procedimentos preliminares; cumprimento de obrigação legal; e legítimo interesse do controlador.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-white mt-8">4. Compartilhamento de Dados</h2>
          <p className="text-white/70">
            Seus dados pessoais poderão ser compartilhados com:
          </p>
          <ul className="text-white/70 space-y-1">
            <li>Parceiros e prestadores de serviços estritamente necessários à execução de nossas atividades (ex.: plataformas de e-mail, CRM, ferramentas de análise);</li>
            <li>Organismos de certificação, quando aplicável à prestação do serviço contratado;</li>
            <li>Autoridades públicas, quando exigido por lei ou regulamentação.</li>
          </ul>
          <p className="text-white/70">
            Não vendemos, alugamos ou comercializamos seus dados pessoais a terceiros.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-white mt-8">5. Armazenamento e Segurança</h2>
          <p className="text-white/70">
            Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acessos não autorizados, perda, alteração ou destruição. Os dados são armazenados em servidores seguros, com acesso restrito a colaboradores autorizados, pelo período necessário ao cumprimento das finalidades descritas nesta política.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-white mt-8">6. Direitos do Titular</h2>
          <p className="text-white/70">Nos termos da LGPD, você tem direito a:</p>
          <ul className="text-white/70 space-y-1">
            <li>Confirmar a existência de tratamento de seus dados;</li>
            <li>Acessar, corrigir ou atualizar seus dados;</li>
            <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários;</li>
            <li>Revogar o consentimento a qualquer momento;</li>
            <li>Solicitar a portabilidade dos dados;</li>
            <li>Obter informações sobre o compartilhamento de seus dados.</li>
          </ul>
          <p className="text-white/70">
            Para exercer seus direitos, entre em contato pelo e-mail: <a href="mailto:privacidade@templum.com.br" className="text-primary hover:underline">privacidade@templum.com.br</a>.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-white mt-8">7. Cookies</h2>
          <p className="text-white/70">
            Nosso site utiliza cookies para melhorar a experiência de navegação, personalizar conteúdo e analisar o tráfego. Você pode gerenciar as preferências de cookies por meio das configurações do seu navegador.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-white mt-8">8. Alterações nesta Política</h2>
          <p className="text-white/70">
            Reservamo-nos o direito de atualizar esta Política de Privacidade a qualquer momento. As alterações serão publicadas nesta página com a data de atualização revisada.
          </p>

          <h2 className="text-lg lg:text-xl font-bold text-white mt-8">9. Contato</h2>
          <p className="text-white/70">
            Em caso de dúvidas sobre esta política ou sobre o tratamento de seus dados pessoais, entre em contato:
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-white/70 text-sm space-y-1 mt-3">
            <p><strong className="text-white/90">Templum Consultoria</strong></p>
            <p>E-mail: <a href="mailto:privacidade@templum.com.br" className="text-primary hover:underline">privacidade@templum.com.br</a></p>
            <p>Site: <a href="https://templum.com.br" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">templum.com.br</a></p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-5 py-6 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-white/30">© 2026 Templum. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default PoliticaPrivacidade;
