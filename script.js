function iniciarSorteio() {
    const btn = document.getElementById('btn-sortear');
    const boxSorteio = document.getElementById('sorteio-box');
    const boxConvite = document.getElementById('convite-box');

    // Feedback visual de clique
    btn.innerText = "Sorteando...";
    btn.style.opacity = "0.7";
    btn.disabled = true;

    // Simula o tempo do sorteio (1.5 segundos)
    setTimeout(() => {
        boxSorteio.classList.add('hidden');
        
        // Pequeno atraso para a animação de entrada
        setTimeout(() => {
            boxSorteio.style.display = "none";
            boxConvite.classList.remove('hidden');
            boxConvite.style.opacity = "1";
            boxConvite.style.transform = "translateY(0)";
        }, 100);
        
    }, 1500);
}