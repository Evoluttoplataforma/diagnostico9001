import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const videoTestimonials = [
  { id: "AmXJaO5GmwM", title: "Depoimento Cliente 1" },
  { id: "7-haMrvop_g", title: "Depoimento Cliente 2" },
  { id: "hiITMFnwrpw", title: "Depoimento Cliente 3" },
  { id: "pMkj_acuvnw", title: "Depoimento Cliente 4" },
  { id: "PYQiJvPXuZc", title: "Depoimento Cliente 5" },
  { id: "6N1AKbCF5J4", title: "Depoimento Cliente 6" },
  { id: "CiA6yRDMWyk", title: "Depoimento Cliente 7" },
  { id: "JSiRLNSH2yE", title: "Depoimento Cliente 8" },
  { id: "nyNr95SChG0", title: "Depoimento Cliente 9" },
  { id: "h4lb_Ws0NFE", title: "Depoimento Cliente 10" },
  { id: "Oq0YeQUrCE0", title: "Depoimento Cliente 11" },
];

const testimonials = [
  {
    name: "Qualidade Transportes Esmeralda",
    text: "Gratidão à Templum pela parceria e suporte durante nossa certificação! A plataforma é prática, completa e facilitou muito todo o processo. Um agradecimento especial à consultora Nathalia, pela dedicação, atenção e competência — sua ajuda fez toda a diferença nessa conquista!",
    rating: 5,
  },
  {
    name: "Informbank Soluções ISO 9001",
    text: "Estou muito, muito satisfeita com o atendimento que tenho recebido do time da Templum, principalmente da consultora Larissa Alarcao, que tem sido altamente profissional, competente e prestativa, oferecendo soluções práticas que realmente fazem a diferença.",
    rating: 5,
  },
  {
    name: "Carlos Eduardo Silva",
    text: "A Templum transformou completamente nossa gestão. Em 6 meses conseguimos a certificação ISO 9001 e já fechamos 3 contratos que antes eram impossíveis sem o selo.",
    rating: 5,
  },
];

const VideoTestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentVideo = videoTestimonials[currentIndex];

  return (
    <div className="relative">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10">
        <iframe
          src={`https://www.youtube.com/embed/${currentVideo.id}`}
          title={currentVideo.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {videoTestimonials.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((p) => (p === 0 ? videoTestimonials.length - 1 : p - 1))}
            className="absolute left-2 lg:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/15 shadow-lg flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Vídeo anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((p) => (p === videoTestimonials.length - 1 ? 0 : p + 1))}
            className="absolute right-2 lg:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/15 shadow-lg flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all duration-300"
            aria-label="Próximo vídeo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => setCurrentIndex((p) => (p === 0 ? videoTestimonials.length - 1 : p - 1))}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all lg:hidden"
          aria-label="Vídeo anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-xs text-white/40 font-medium">{currentIndex + 1} / {videoTestimonials.length}</span>
        <button
          onClick={() => setCurrentIndex((p) => (p === videoTestimonials.length - 1 ? 0 : p + 1))}
          className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all lg:hidden"
          aria-label="Próximo vídeo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export const TestimonialsSection = () => {
  return (
    <section className="px-5 py-6 lg:py-14 lg:px-16 bg-[hsl(var(--hero-dark-accent))]">
      <div className="max-w-6xl mx-auto">
        {/* Google Reviews Header */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 shadow-lg mb-5">
            <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-white/60 text-sm font-medium">Avaliações no Google</span>
          </div>

          <div className="flex flex-col items-center gap-3 mb-5">
            <div className="flex items-center gap-2">
              <span className="text-4xl lg:text-5xl font-extrabold text-white">4,9</span>
              <div className="flex flex-col items-start">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 lg:w-6 lg:h-6 text-primary fill-primary" />
                  ))}
                </div>
                <span className="text-white/40 text-sm">+500 avaliações</span>
              </div>
            </div>
          </div>

          <h2 className="text-xl lg:text-3xl font-extrabold text-white uppercase tracking-tight mb-2">
            O que nossos clientes dizem após{" "}
            <span className="text-primary">implementar a ISO 9001</span>
          </h2>
        </div>

        {/* Written Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-white/5 rounded-xl p-5 lg:p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="absolute -top-2 right-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Quote className="w-4 h-4 text-primary" />
                </div>
              </div>

              <div className="flex gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                ))}
              </div>

              <p className="text-sm text-white/70 leading-relaxed mb-4">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{testimonial.name}</p>
                  <p className="text-xs text-white/40">Cliente verificado</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonials */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-base lg:text-xl font-bold text-white/80 text-center mb-5 uppercase tracking-wider">
            Veja o que nossos clientes têm a dizer
          </h3>
          <VideoTestimonialsCarousel />
        </div>
      </div>
    </section>
  );
};
