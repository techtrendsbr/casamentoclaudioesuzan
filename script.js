// === PRELOADER & UNLOCK ===
window.addEventListener('load', () => {
    const video = document.getElementById('intro-video');
    const preloader = document.getElementById('preloader');
    const hero = document.getElementById('hero-static');
    const introContainer = document.getElementById('intro-container');
    
    // Variável para garantir que unlock seja chamado apenas uma vez
    let unlocked = false;

    function startSite() {
        preloader.style.opacity = '0';
        setTimeout(() => { 
            preloader.style.display = 'none';
            
            // Garante que o vídeo está pronto antes de tentar reproduzir
            if (video.readyState >= 2) {
                playVideo();
            } else {
                video.addEventListener('loadeddata', playVideo, { once: true });
            }
            
            // Timeout de segurança caso o vídeo não carregue
            setTimeout(() => {
                if (!unlocked) {
                    console.log('Vídeo não carregou a tempo, desbloqueando site...');
                    unlock();
                }
            }, 5000);
        }, 500);
    }

    function playVideo() {
        if (unlocked) return;
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Vídeo iniciado com sucesso');
                })
                .catch(error => {
                    console.log('Não foi possível reproduzir o vídeo automaticamente:', error);
                    unlock();
                });
        }
    }

    function unlock() {
        if (unlocked) return;
        unlocked = true;
        
        console.log('Desbloqueando site...');
        introContainer.style.opacity = '0';
        setTimeout(() => {
            introContainer.style.display = 'none';
            hero.classList.remove('hidden');
            document.body.classList.remove('scroll-locked');
        }, 800);
    }

    video.addEventListener('ended', unlock, { once: true });
    
    // Adiciona listener para erros de vídeo
    video.addEventListener('error', (e) => {
        console.error('Erro ao carregar vídeo:', e);
        unlock();
    }, { once: true });
    
    startSite();
});

// === TIMER ===
const weddingDate = new Date('2026-09-27T16:00:00').getTime();
setInterval(() => {
    const now = new Date().getTime();
    const diff = weddingDate - now;
    if (diff < 0) return;
    document.getElementById('d').innerText = Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(3, '0');
    document.getElementById('h').innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById('m').innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById('s').innerText = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0');
}, 1000);

// === SCROLL LOGIC ===
window.addEventListener('scroll', () => {
    if (document.body.classList.contains('scroll-locked')) return;
    const scrollY = window.scrollY;
    const h = window.innerHeight;

    const getProgress = (id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const start = el.offsetTop;
        const dist = el.offsetHeight - h;
        return Math.min(Math.max((scrollY - start) / dist, 0), 1);
    };

    // 1. Jornada (Cards)
    const pJourney = getProgress('journey');
    const cards = document.querySelectorAll('.stacked-card');
    cards.forEach((card, i) => {
        const step = 0.6 / cards.length;
        const prog = Math.min(Math.max((pJourney - (i * step)) / 0.3, 0), 1);
        const rot = (i % 2 === 0 ? -10 : 10) * prog;
        card.style.transform = `translate(-50%, -50%) rotate(${rot}deg) scale(${0.8 + (prog * 0.2)})`;
        card.style.left = "50%"; card.style.top = "50%";
        card.style.opacity = prog;
    });
    const jBtn = document.getElementById('journey-btn');
    if(pJourney > 0.8) jBtn.classList.add('visible'); else jBtn.classList.remove('visible');

    // 2. Proposal (Ring)
    const pProp = getProgress('proposal');
    const ring = document.getElementById('rolling-ring');
    const wire = document.getElementById('ring-wire');
    if (wire && ring) {
        const len = wire.getTotalLength();
        const point = wire.getPointAtLength(pProp * len);
        ring.setAttribute('transform', `translate(${point.x}, ${point.y})`);
    }

    // 3. Venue Split (Timeline)
    const pVenue = getProgress('venue-split');
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, i) => {
        if(pVenue > (i / items.length)) item.classList.add('active');
        else item.classList.remove('active');
    });

    // Navbar Active
    const sections = ['hero-static', 'journey', 'proposal', 'padrinhos', 'venue-split', 'rsvp'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if(el){
            const rect = el.getBoundingClientRect();
            if(rect.top < h/2 && rect.bottom > h/2){
                document.querySelectorAll('.nav-item').forEach(n => {
                    n.classList.remove('active');
                    if(n.getAttribute('href') === `#${id}`) n.classList.add('active');
                });
            }
        }
    });
});

// === MODAIS ===
function openGallery() { document.getElementById('modal-gallery').classList.add('active'); }
function closeGallery() { document.getElementById('modal-gallery').classList.remove('active'); }
function expandImage(img) { 
    document.getElementById('lightbox-img').src = img.src; 
    document.getElementById('lightbox').classList.add('active'); 
}
function closeVideo() { document.getElementById('proposal-video-container').classList.remove('active'); }

function copiarPixChave() {
    const chave = "claudioesuzan@email.com";
    navigator.clipboard.writeText(chave).then(() => {
        alert("Chave Pix copiada com sucesso!");
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
}
