// Evento de sortear grupos
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
        grupos = dividirEmGrupos(nomes, tamanhoGrupo, 'grupos');
    } else {
        grupos = dividirEmGrupos(nomes, tamanhoGrupo, 'membros');
    }

    mostrarResultado(grupos);
});

// Função para dividir os nomes em grupos
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

// Função para mostrar o resultado na tela
function mostrarResultado(grupos) {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';  // Limpa o conteúdo anterior
    grupos.forEach((grupo, index) => {
        const grupoDiv = document.createElement('div');
        grupoDiv.innerHTML = `<h3>Grupo ${index + 1}</h3><p>${grupo.join(', ')}</p>`;
        resultadoDiv.appendChild(grupoDiv);
    });
}

// Função para testar a API
document.getElementById('testeAPI').addEventListener('click', function() {
    fetch('http://18.222.97.27:8080/teste/hello')
        .then(response => response.json())
        .then(data => {
            alert('API funcionando: ' + data.message);  // Exibe a mensagem retornada pela API
        })
        .catch(error => showToast('Erro ao testar a API: ' + error.message));  // Exibe toast em caso de erro
});

// Função para baixar o PDF
document.getElementById('downloadPDF').addEventListener('click', function() {
    let content = '';
    const grupos = document.querySelectorAll('#resultado div');
    grupos.forEach(grupo => {
        content += grupo.innerText + '\n\n';
    });

    fetch('http://18.222.97.27:8080/api/gerar-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ conteudo: content })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha ao gerar o PDF.');
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

// Função para exibir uma mensagem de erro (toast)
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