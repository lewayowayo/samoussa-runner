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
            soundIcon.addEventListener('click', () => {
                this.toggleMute();
                soundIcon.src = this.isMuted ? 'assets/sound-off.png' : 'assets/sound-on.png';
                soundIcon.alt = this.isMuted ? 'Son désactivé' : 'Son activé';
            });
        }
        
        // Gérer l'autoplay sur mobile (nécessite interaction utilisateur)
        document.addEventListener('touchstart', () => {
            if (this.currentMusic && this.bgMusic.paused && !this.isMuted) {
                this.playMusic(this.currentMusic);
            }
        }, { once: true });
    },
    
    // Précharger un effet sonore
    loadSound: function(name, path) {
        this.sounds[name] = new Audio(path);
        this.sounds[name].preload = 'auto';
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
        
        // Cloner le son pour permettre plusieurs instances simultanées
        const sound = this.sounds[name].cloneNode();
        sound.volume = 0.7; // 70% du volume
        
        const playPromise = sound.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log(`Could not play sound: ${name}`);
            });
        }
    },
    
    // Activer/désactiver tous les sons
    toggleMute: function() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.bgMusic.pause();
        } else if (this.currentMusic) {
            this.playMusic(this.currentMusic);
        }
        
        // Sauvegarder la préférence utilisateur
        try {
            localStorage.setItem('wayowayoSoundMuted', this.isMuted);
        } catch (e) {
            console.log('Could not save sound preference');
        }
    }
};

// Initialiser le système audio lors du chargement
document.addEventListener('DOMContentLoaded', function() {
    AudioManager.init();
    
    // Charger la préférence utilisateur
    try {
        const savedMute = localStorage.getItem('wayowayoSoundMuted');
        if (savedMute !== null) {
            AudioManager.isMuted = savedMute === 'true';
            document.getElementById('sound-icon').src = AudioManager.isMuted ? 
                'assets/sound-off.png' : 'assets/sound-on.png';
        }
    } catch (e) {
        console.log('Could not load sound preference');
    }
});