document.addEventListener('DOMContentLoaded', function() {
    // Seulement sur Android et pas en mode PWA
    if (/Android/i.test(navigator.userAgent) && !window.matchMedia('(display-mode: standalone)').matches) {
        showPWAPrompt();
    }
    
    // Configurer le message selon la plateforme
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        document.getElementById('ios-install').style.display = 'block';
    } else {
        document.getElementById('android-install').style.display = 'block';
    }
    
    // Gérer le bouton "Continuer quand même"
    document.getElementById('continue-browser').addEventListener('click', function() {
        document.getElementById('pwa-prompt').style.display = 'none';
        
        // Sauvegarder que l'utilisateur a ignoré l'invite
        try {
            localStorage.setItem('pwaPromptIgnored', 'true');
        } catch (e) {
            console.warn("Impossible de sauvegarder la préférence PWA:", e);
        }
        
        // Démarrer le jeu
        if (typeof startGame === 'function') {
            startGame();
        }
    });
});

function showPWAPrompt() {
    // Vérifier si l'utilisateur a déjà ignoré l'invite aujourd'hui
    try {
        const lastPromptDate = localStorage.getItem('pwaPromptLastShown');
        const now = new Date().toDateString();
        
        // Afficher le prompt une fois par jour (au lieu d'une seule fois)
        if (lastPromptDate === now) {
            return;
        }
        
        // Mettre à jour la date de dernière apparition
        localStorage.setItem('pwaPromptLastShown', now);
    } catch (e) {
        console.warn("Impossible de gérer la préférence PWA:", e);
    }
    
    // Afficher l'invite PWA 
    document.getElementById('pwa-prompt').style.display = 'flex';
    
    // Masquer l'écran de démarrage normal
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.style.display = 'none';
    }
}