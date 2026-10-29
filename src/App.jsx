import DotGrid from './components/DotGrid';
import Hero from './components/Hero';
import Thesis from './components/Thesis';
import StorySequence from './components/StorySequence';
import ProductChapters from './components/ProductChapters';
import ZodiacStage from './components/ZodiacStage';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';

export default function App() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <section id="why" style={{ background: '#F3FAFA', padding: '120px 40px' }}>
          <Thesis />
        </section>
        <StorySequence />
        <section id="features" style={{ background: '#F3FAFA', padding: '100px 40px' }}>
          <ProductChapters />
        </section>
        <section id="zodiac" style={{ background: '#131313', padding: '100px 40px' }}>
          <ZodiacStage />
        </section>
        <section id="contact" style={{ background: '#0a0a0a', padding: '80px 40px' }}>
          <SiteFooter />
        </section>
      </main>
    </>
  );
}
