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
    // Vérifier si l'utilisateur a déjà ignoré l'invite
    try {
        if (localStorage.getItem('pwaPromptIgnored') === 'true') {
            return;
        }
    } catch (e) {
        console.warn("Impossible de charger la préférence PWA:", e);
    }
    
    // Afficher l'invite PWA 
    document.getElementById('pwa-prompt').style.display = 'flex';
    
    // Masquer l'écran de démarrage normal
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
        startScreen.style.display = 'none';
    }
}