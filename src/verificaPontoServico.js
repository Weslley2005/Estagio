const fs = require('fs');

async function verificarPontoServico(pontoIndex) {
    try {
        const rawData = fs.readFileSync('Dados.json');
        const dados = JSON.parse(rawData);

        const pontoField = `pontos_${pontoIndex}`;

        const funcionarios = dados.map(funcionario => ({
            nome: funcionario.nomeFunc,
            ponto: funcionario[pontoField]
        }));

        const funcionariosSemPonto = funcionarios.filter(funcionario => !funcionario.ponto);

        if (funcionariosSemPonto.length > 0) {
            console.log('Funcionários que não bateram o ponto:');
            funcionariosSemPonto.forEach(funcionario => {
                console.log(funcionario.nome);
            });
            return funcionariosSemPonto.map(funcionario => funcionario.nome);
        } else {
            console.log('Todos os funcionários bateram o ponto.');
            return [];
        }
    } catch (error) {
        console.error('Erro ao verificar funcionários sem ponto:', error);
        throw error;
    }
}

module.exports = { verificarPontoServico };
