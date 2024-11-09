document.getElementById('groupType').addEventListener('change', function() {
    const tipoDivisao = document.getElementById('groupType').value;
    const groupSizeInput = document.getElementById('groupSize');
    
    if (tipoDivisao === 'sortearGanhador') {
        groupSizeInput.style.display = 'none';
        groupSizeInput.disabled = true;
    } else {
        groupSizeInput.style.display = 'block';
        groupSizeInput.disabled = false;
    }
});

document.getElementById('sortear').addEventListener('click', function() {
    const nomes = document.getElementById('nomes').value.trim().split('\n');
    const tipoDivisao = document.getElementById('groupType').value;
    const tamanhoGrupo = parseInt(document.getElementById('groupSize').value);

    if (nomes.length === 0 || (tipoDivisao !== 'sortearGanhador' && (isNaN(tamanhoGrupo) || tamanhoGrupo <= 0))) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    if (tipoDivisao === 'sortearGanhador') {
        const sorteado = nomes[Math.floor(Math.random() * nomes.length)];
        mostrarResultado(`O sorteado é: ${sorteado}`);
    } else {
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
    }
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

function mostrarResultado(resultado) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';
    if (typeof resultado === 'string') {
        resultadoDiv.innerHTML = `<h3>${resultado}</h3>`;
    } else {
        resultado.forEach((grupo, index) => {
            const grupoDiv = document.createElement('div');
            grupoDiv.innerHTML = `<h3>Grupo ${index + 1}</h3><p>${grupo.join(', ')}</p>`;
            resultadoDiv.appendChild(grupoDiv);
        });
    }
}

document.getElementById('testeAPI').addEventListener('click', function() {
    fetch('http://localhost:8080/teste/hello')
    .then(data => {
        alert('API funcionando. Faça o sorteio!');
    })
    .catch(error => showToast('Http 500 - Internal Server Error: - Erro ao testar a API. Verifique o sistema.'));
});

document.getElementById('downloadPDF').addEventListener('click', function() {
    let content = '';

    const grupos = document.querySelectorAll('#resultado div');
    grupos.forEach(grupo => {
        content += grupo.innerText + '\n\n';
    });

    fetch('http://localhost:8080/api/gerar-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ conteudo: content })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao gerar o PDF. Faça o teste de conexão da API.');
        }
        return response.blob();
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resultado.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => showToast(error.message));
});

function showToast(message) {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = '#e74c3c'; 
    toast.style.color = '#fff';
    toast.style.padding = '10px 20px';
    toast.style.borderRadius = '5px';
    toast.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}
