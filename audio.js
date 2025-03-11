// Gestionnaire audio principal
const AudioManager = {
    // Paramètres
    isMuted: false,
    bgMusic: null,
    sounds: {},
    currentMusic: null,
    
    // Initialiser le système audio
    init: function() {
        // Créer les éléments audio
        this.bgMusic = new Audio();
        this.bgMusic.loop = true;
        this.bgMusic.volume = 0.4; // 40% du volume
        
        // Précharger les effets sonores
        this.loadSound('jump', 'sounds/jump.mp3');
        this.loadSound('collect', 'sounds/collect.mp3');
        this.loadSound('crash', 'sounds/crash.mp3');
        this.loadSound('levelUp', 'sounds/level-up.mp3');
        this.loadSound('powerup', 'sounds/powerup.mp3');
        
        // Configurer le contrôle du son
        const soundIcon = document.getElementById('sound-icon');
        if (soundIcon) {
            // Gestionnaire d'événement pour le clic
            soundIcon.addEventListener('click', (event) => {
                // Empêcher la propagation de l'événement vers le conteneur du jeu
                event.stopPropagation();
                
                // Empêcher le comportement par défaut
                event.preventDefault();
                
                this.toggleMute();
                soundIcon.src = this.isMuted ? 'assets/sound-off.png' : 'assets/sound-on.png';
                soundIcon.alt = this.isMuted ? 'Son désactivé' : 'Son activé';
                
                console.log("Son " + (this.isMuted ? "désactivé" : "activé") + " via click");
            });
            
            // Gestionnaire d'événement pour le toucher (mobile)
            soundIcon.addEventListener('touchend', (event) => {
                // Empêcher la propagation et le comportement par défaut
                event.stopPropagation();
                event.preventDefault();
                
                this.toggleMute();
                soundIcon.src = this.isMuted ? 'assets/sound-off.png' : 'assets/sound-on.png';
                soundIcon.alt = this.isMuted ? 'Son désactivé' : 'Son activé';
                
                console.log("Son " + (this.isMuted ? "désactivé" : "activé") + " via touchend");
            }, { passive: false });
        }
        
        // Également empêcher la propagation sur le conteneur
        const audioControls = document.getElementById('audio-controls');
        if (audioControls) {
            audioControls.addEventListener('click', (event) => {
                event.stopPropagation();
            });
            
            // Empêcher aussi les événements tactiles sur mobile
            audioControls.addEventListener('touchstart', (event) => {
                event.stopPropagation();
            }, { passive: false });
            
            audioControls.addEventListener('touchend', (event) => {
                event.stopPropagation();
            }, { passive: false });
        }
        
        // Gérer l'autoplay sur mobile (nécessite interaction utilisateur)
        document.addEventListener('touchstart', () => {
            if (this.currentMusic && this.bgMusic.paused && !this.isMuted) {
                this.playMusic(this.currentMusic);
            }
        }, { once: true });
        
        // Charger la préférence utilisateur
        try {
            const savedMute = localStorage.getItem('wayowayoSoundMuted');
            if (savedMute !== null) {
                this.isMuted = savedMute === 'true';
                if (soundIcon) {
                    soundIcon.src = this.isMuted ? 'assets/sound-off.png' : 'assets/sound-on.png';
                    soundIcon.alt = this.isMuted ? 'Son désactivé' : 'Son activé';
                }
                console.log("Préférence de son chargée: " + (this.isMuted ? "désactivé" : "activé"));
            }
        } catch (e) {
            console.log('Could not load sound preference');
        }
    },
    
    // Précharger un effet sonore
    loadSound: function(name, path) {
        try {
            this.sounds[name] = new Audio(path);
            this.sounds[name].preload = 'auto';
            console.log(`Son '${name}' chargé depuis ${path}`);
        } catch (e) {
            console.log(`Impossible de charger le son: ${name} depuis ${path}`);
        }
    },
    
    // Jouer la musique de fond
    playMusic: function(path) {
        if (this.isMuted) return;
        
        this.currentMusic = path;
        
        if (this.bgMusic.src !== path) {
            this.bgMusic.src = path;
        }
        
        // Certains navigateurs mobiles nécessitent une promesse
        const playPromise = this.bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // L'autoplay a été empêché, nous attendons l'interaction utilisateur
                console.log('Autoplay prevented, waiting for user interaction');
            });
        }
    },
    
    // Jouer un effet sonore
    playSound: function(name) {
        if (this.isMuted || !this.sounds[name]) return;
        
        try {
            // Cloner le son pour permettre plusieurs instances simultanées
            const sound = this.sounds[name].cloneNode();
            sound.volume = 0.7; // 70% du volume
            
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log(`Could not play sound: ${name}`);
                });
            }
        } catch (e) {
            console.log(`Erreur lors de la lecture du son ${name}: ${e.message}`);
        }
    },
    
    // Activer/désactiver tous les sons
    toggleMute: function() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            if (this.bgMusic) {
                this.bgMusic.pause();
            }
        } else if (this.currentMusic) {
            this.playMusic(this.currentMusic);
        }
        
        // Sauvegarder la préférence utilisateur
        try {
            localStorage.setItem('wayowayoSoundMuted', this.isMuted.toString());
            console.log("Préférence de son sauvegardée: " + (this.isMuted ? "désactivé" : "activé"));
        } catch (e) {
            console.log('Could not save sound preference');
        }
        
        return this.isMuted; // Retourner l'état actuel
    }
};

// Initialiser le système audio lors du chargement
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initialisation du système audio...");
    AudioManager.init();
});