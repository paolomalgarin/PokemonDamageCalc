// Funzione per inizializzare le barre HP
const initializeHPBars = () => {
    let hpBars = document.querySelectorAll('.hp-input-range');

    hpBars.forEach(hpBar => {
        addBarResponsiveStyle(hpBar);
    });
};

const addBarResponsiveStyle = (hpBar) => {
    hpBar.addEventListener('input', (e) => {
        const value = e.target.value;
        const max = e.target.max || 100; // Default a 100 se manca l'attributo
        const percentage = (value / max) * 100;

        // Aggiorna la CSS variable
        e.target.style.setProperty('--fill-percentage', percentage + '%');

        // setto il colore
        if (percentage < 50) {
            if (percentage < 20) {
                e.target.style.setProperty('--light-fill-color', 'var(--red)');
                e.target.style.setProperty('--dark-fill-color', 'var(--dark-red)');
            } else {
                e.target.style.setProperty('--light-fill-color', 'var(--orange)');
                e.target.style.setProperty('--dark-fill-color', 'var(--dark-orange)');
            }
        } else {
            e.target.style.setProperty('--light-fill-color', 'var(--green)');
            e.target.style.setProperty('--dark-fill-color', 'var(--dark-green)');
        }
    });
}


initializeHPBars();