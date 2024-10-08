document.getElementById('sortear').addEventListener('click', function() {
    const nomes = document.getElementById('nomes').value.trim().split('\n');
    const tipoDivisao = document.getElementById('groupType').value;
    const tamanhoGrupo = parseInt(document.getElementById('groupSize').value);

    if (nomes.length === 0 || isNaN(tamanhoGrupo) || tamanhoGrupo <= 0) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    // Embaralhar nomes
    nomes.sort(() => Math.random() - 0.5);

    let grupos = [];
    if (tipoDivisao === 'numGrupos') {
        const numGrupos = tamanhoGrupo;
        grupos = dividirEmGrupos(nomes, numGrupos, 'grupos');
    } else {
        const numMembros = tamanhoGrupo;
        grupos = dividirEmGrupos(nomes, numMembros, 'membros');
    }

    mostrarResultado(grupos);
});

function dividirEmGrupos(nomes, tamanho, tipo) {
    let grupos = [];
    if (tipo === 'grupos') {
        const numGrupos = tamanho;
        for (let i = 0; i < numGrupos; i++) {
            grupos[i] = [];
        }
        nomes.forEach((nome, index) => {
            grupos[index % numGrupos].push(nome);
        });
    } else {
        const numMembros = tamanho;
        while (nomes.length) {
            grupos.push(nomes.splice(0, numMembros));
        }
    }
    return grupos;
}

function mostrarResultado(grupos) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';
    grupos.forEach((grupo, index) => {
        const grupoDiv = document.createElement('div');
        grupoDiv.innerHTML = `<h3>Grupo ${index + 1}</h3><p>${grupo.join(', ')}</p>`;
        resultadoDiv.appendChild(grupoDiv);
    });
}

document.getElementById('downloadPDF').addEventListener('click', function() {
    const doc = new jsPDF();
    let content = '';

    const grupos = document.querySelectorAll('#resultado div');
    grupos.forEach(grupo => {
        content += grupo.innerText + '\n\n';
    });

    doc.text(content, 10, 10);
    doc.save('resultado.pdf');
});
