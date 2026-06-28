import { useEffect } from 'react'
import { Link } from 'react-router-dom'

// Import components from components/landing/
import '../components/landing/landing.css'
import HeroSection from '../components/landing/hero_section'
import AboutUsSection from '../components/landing/aboutUs_section'
import Roadmap from '../components/landing/roadmap'
import Parcours from '../components/landing/parcours'
import CompteARebours from '../components/landing/compte_a_rebours'

export default function LandingPage() {

  // AURORA BACKGROUND
  useEffect(() => {
    const canvas = document.getElementById('aurora')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, t = 0

    function rsz() {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', rsz)
    rsz()

    const blobs = [
      { x: .15, y: .55, c: 'rgba(79,70,229,', ox: 0, oy: 0 },
      { x: .85, y: .2, c: 'rgba(124,92,252,', ox: 1, oy: 1 },
      { x: .55, y: .85, c: 'rgba(244,114,182,', ox: 2, oy: 2 },
      { x: .3, y: .1, c: 'rgba(56,189,248,', ox: 3, oy: 3 },
    ]

    let animId
    function draw() {
      ctx.clearRect(0, 0, W, H)
      t += .007
      blobs.forEach(b => {
        const px = (b.x + Math.sin(t * .7 + b.ox) * .13) * W
        const py = (b.y + Math.cos(t * .5 + b.oy) * .1) * H
        const r = .4 * Math.min(W, H)
        const g = ctx.createRadialGradient(px, py, 0, px, py, r)
        g.addColorStop(0, b.c + '.14)')
        g.addColorStop(.4, b.c + '.06)')
        g.addColorStop(1, b.c + '0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(px, py, r, 0, Math.PI * 2)
        ctx.fill()
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', rsz)
      cancelAnimationFrame(animId)
    }
  }, [])

  // CUSTOM CURSOR
  useEffect(() => {
    const dot = document.getElementById('cdot')
    const ring = document.getElementById('cring')
    if (!dot || !ring) return
    let mx = 0, my = 0, rx = 0, ry = 0

    const onMove = e => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = mx + 'px'
      dot.style.top = my + 'px'
    }
    document.addEventListener('mousemove', onMove)

    let rafId
    function ar() {
      rx += (mx - rx) * .13
      ry += (my - ry) * .13
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      rafId = requestAnimationFrame(ar)
    }
    ar()

    const onEnter = () => { dot.classList.add('g'); ring.classList.add('g') }
    const onLeave = () => { dot.classList.remove('g'); ring.classList.remove('g') }
    const targets = document.querySelectorAll('a,button,.bcell,.stepcard,.pcard,.cdunit')
    targets.forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      targets.forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  // SCROLL REVEAL
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('on')
          obs.unobserve(e.target)
        }
      })
    }, { threshold: .06 })

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // NAV SCROLL
  useEffect(() => {
    const onScroll = () => {
      const nav = document.getElementById('nav')
      if (nav) nav.classList.toggle('sc', window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Custom cursor */}
      <div className="cdot" id="cdot" />
      <div className="cring" id="cring" />

      {/* Aurora background */}
      <canvas id="aurora" />

      {/* Navbar */}
      <nav id="nav">
        <a href="#" className="nlogo">
          <div className="nmark">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 3h9a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="rgba(255,255,255,0.92)"/>
              <path d="M3 4v12" stroke="rgba(167,139,250,0.9)" strokeWidth="2" strokeLinecap="round"/>
              <line x1="7" y1="8" x2="13" y2="8" stroke="rgba(167,139,250,0.5)" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="7" y1="11" x2="13" y2="11" stroke="rgba(167,139,250,0.5)" strokeWidth="1.4" strokeLinecap="round"/>
              <line x1="7" y1="14" x2="11" y2="14" stroke="rgba(167,139,250,0.5)" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="nname">BacAidz</span>
        </a>
        <ul className="nlinks">
          <li><a href="#about">المنصة</a></li>
          <li><a href="#roadmap">خريطة الطريق</a></li>
          <li><a href="#phases">المراحل</a></li>
          <li><a href="#countdown">العد التنازلي</a></li>
        </ul>
        <Link to="/signup" className="npill">
  ابدأ الآن
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    <path d="M2 6.5h9M7.5 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</Link>
      </nav>

      {/* Sections */}
      <HeroSection />
      <AboutUsSection />
      <Roadmap />
      <Parcours />
      <CompteARebours />

      {/* CTA */}
      <section id="cta">
        <div className="ctai reveal">
          <div className="lbadge" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            <span className="bping" />انضم إلى المجتمع
          </div>
          <h2 className="ctah">هل أنت مستعد لاجتياز<br />شهادة <span>البكالوريا؟</span></h2>
          <p className="ctap">آلاف التلاميذ الجزائريين يستخدمون بالفعل BacAidz للتحضير للبكالوريا بثقة. انضم إليهم اليوم — وهو مجاني بالكامل.</p>
          <div className="ctabtns">
            <a href="#roadmap" className="bprime" style={{ fontSize: '.98rem', padding: '1.05rem 2.3rem' }}>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <path d="M8.5 1.5l2.3 6.9H17L11.6 12l2.3 6.9-5.4-3.9-5.4 3.9L5.4 12 0 8.4h6.2z" fill="white"/>
              </svg>
              ابدأ مجاناً
            </a>
            <a href="#about" className="bghost">
              اعرف المزيد
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 6.5h9M7.5 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
          <div className="srow">
            <div className="avs">
              <div className="av" style={{ background: 'linear-gradient(135deg,#7c5cfc,#4f46e5)' }}>أ</div>
              <div className="av" style={{ background: 'linear-gradient(135deg,#f472b6,#ec4899)' }}>ن</div>
              <div className="av" style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)' }}>ي</div>
              <div className="av" style={{ background: 'linear-gradient(135deg,#2dd4bf,#0891b2)', color: '#0a0d1a' }}>م</div>
              <div className="av" style={{ background: 'linear-gradient(135deg,#a78bfa,#7c5cfc)' }}>ك</div>
            </div>
            <span>+12 000 تلميذ يثقون بنا</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="flogo">
          <div className="fmark">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M4 3h9a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="rgba(255,255,255,0.92)"/>
              <path d="M3 4v12" stroke="rgba(167,139,250,0.9)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="fname">BacAidz</span>
        </div>
        <span className="fnote">© 2026 BacAidz · صُنع من أجل تلاميذ البكالوريا الجزائريين 🇩🇿</span>
      </footer>
    </>
  )
}