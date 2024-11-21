import { DatabaseModel } from "./DatabaseModel";

const database = new DatabaseModel().pool;

/**
 * Classe que representa um carro.
 */
export class Carro {

    /* Atributos */
    /* Identificador do carro */
    private idCarro: number = 0;
    /* marca do carro */
    private marca: string;
    /* modelo do carro */
    private modelo: string;
    /* ano de fabrição do carro */
    private ano: number;
    /* cor do carro */
    private cor: string;

    /**
     * Construtor da classe Carro
     * 
     * @param marca Marca do carro
     * @param modelo Modelo do carro
     * @param ano Ano de fabricação do carro
     * @param cor Cor do carro
     */
    constructor(
        marca: string,
        modelo: string,
        ano: number,
        cor: string
    ) {
        this.marca = marca;
        this.modelo = modelo;
        this.ano = ano;
        this.cor = cor;
    }

    /* Métodos get e set */
    /**
     * Recupera o identificador do carro
     * @returns o identificador do carro
     */
    public getIdCarro(): number {
        return this.idCarro;
    }

    /**
     * Atribui um valor ao identificador do carro
     * @param idCarro novo identificado do carro
     */
    public setIdCarro(idCarro: number): void {
        this.idCarro = idCarro;
    }

    /**
     * Retorna a marca do carro.
     *
     * @returns {string} A marca do carro.
     */
    public getMarca(): string {
        return this.marca;
    }

    /**
     * Define a marca do carro.
     * 
     * @param marca - A marca do carro a ser definida.
     */
    public setMarca(marca: string): void {
        this.marca = marca;
    }

    /**
     * Retorna o modelo do carro.
     *
     * @returns {string} O modelo do carro.
     */
    public getModelo(): string {
        return this.modelo;
    }

    /**
     * Define o modelo do carro.
     *
     * @param modelo - O nome do modelo do carro.
     */
    public setModelo(modelo: string): void {
        this.modelo = modelo;
    }

    /**
     * Retorna o ano do carro.
     *
     * @returns O ano do carro.
     */
    public getAno(): number {
        return this.ano;
    }

    /**
     * Define o ano do carro.
     * 
     * @param ano - O ano a ser definido para o carro.
     */
    public setAno(ano: number): void {
        this.ano = ano;
    }

    /**
     * Retorna a cor do carro.
     *
     * @returns {string} A cor do carro.
     */
    public getCor(): string {
        return this.cor;
    }

    /**
     * Define a cor do carro.
     * 
     * @param cor - A nova cor do carro.
     */
    public setCor(cor: string): void {
        this.cor = cor;
    }

    /**
     * O método listarCarros executa uma consulta SQL para buscar todos os carros da tabela carro no banco de dados.
     * @returns todos os carros encontrados no banco de dados.
     */
    static async listarCarros(): Promise<Array<Carro> | null> {

        let listaDeCarros: Array<Carro> = [];

        try {

            //query de consulta no banco de dados
            const querySelectCarro = `SELECT * FROM carro;`;


            const respostaBD = await database.query(querySelectCarro);

            respostaBD.rows.forEach((carro) => {
                let novoCarro = new Carro(
                    carro.marca,
                    carro.modelo,
                    carro.ano,
                    carro.cor
                );

                //atribuir objeito
                novoCarro.setIdCarro(carro.id_carro);

                //adicionar o objeto na lista
                listaDeCarros.push(novoCarro);

            });

            return listaDeCarros;


        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    /**
     * Realiza o cadastro de um carro no banco de dados.
     * 
     * Esta função recebe um objeto do tipo `Carro` e insere seus dados (marca, modelo, ano e cor)
     * na tabela `carro` do banco de dados. O método retorna um valor booleano indicando se o cadastro 
     * foi realizado com sucesso.
     * 
     * @param {Carro} carro - Objeto contendo os dados do carro que será cadastrado. O objeto `Carro`
     *                        deve conter os métodos `getMarca()`, `getModelo()`, `getAno()` e `getCor()`
     *                        que retornam os respectivos valores do carro.
     * @returns {Promise<boolean>} - Retorna `true` se o carro foi cadastrado com sucesso e `false` caso contrário.
     *                               Em caso de erro durante o processo, a função trata o erro e retorna `false`.
     * 
     * @throws {Error} - Se ocorrer algum erro durante a execução do cadastro, uma mensagem de erro é exibida
     *                   no console junto com os detalhes do erro.
     */
    static async cadastroCarro(carro: Carro): Promise<boolean> {
        try {
            // query para fazer insert de um carro no banco de dados
            const queryInsertCarro = `INSERT INTO carro (marca, modelo, ano, cor)
                                        VALUES
                                        ('${carro.getMarca()}', 
                                        '${carro.getModelo()}', 
                                        ${carro.getAno()}, 
                                        '${carro.getCor()}')
                                        RETURNING id_carro;`;

            // executa a query no banco e armazena a resposta
            const respostaBD = await database.query(queryInsertCarro);

            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Carro cadastrado com sucesso! ID do carro: ${respostaBD.rows[0].id_carro}`);
                // true significa que o cadastro foi feito
                return true;
            }
            // false significa que o cadastro NÃO foi feito.
            return false;

            // tratando o erro
        } catch (error) {
            // imprime outra mensagem junto com o erro
            console.log('Erro ao cadastrar o carro. Verifique os logs para mais detalhes.');
            // imprime o erro no console
            console.log(error);
            // retorno um valor falso
            return false;
        }
    }
    /**
         * Remove um carro do banco de dados com base no ID fornecido.
         * 
         * Esta função executa uma operação de exclusão na tabela carro para remover um registro cujo id_carro 
         * corresponda ao valor fornecido. Ela retorna um valor booleano indicando o sucesso ou a falha da operação.
         * 
         * @param {number} idCarro - O identificador único do carro que será removido do banco de dados.
         * @returns {Promise<boolean>} - Retorna true se o carro foi removido com sucesso, ou false caso contrário.
         *                                Em caso de erro, a função trata a exceção e retorna false.
         * 
         * @throws {Error} - Exibe uma mensagem de erro no console e os detalhes do erro caso a remoção falhe.
         */


    static async removerCarro(idCarro: number): Promise<boolean> {
        try {
            // Cria uma query SQL para deletar o carro do banco de dados baseado no ID.
            const queryDeleteCarro = `DELETE FROM carro WHERE id_carro = ${idCarro}`;

            // Executa a query no banco de dados e armazena a resposta.
            const respostaBD = await database.query(queryDeleteCarro);

            // Verifica se alguma linha foi afetada pela operação de exclusão.
            if (respostaBD.rowCount != 0) {
                // Loga uma mensagem de sucesso no console indicando que o carro foi removido.
                console.log(`Carro removido com sucesso! ID removido: ${idCarro}`);
                // Retorna true para indicar sucesso na remoção.
                return true;
            }

            // Retorna false se nenhuma linha foi afetada (nenhum carro removido).
            return false;

        } catch (error) {
            // Exibe uma mensagem de erro no console caso ocorra uma exceção.
            console.log('Erro ao remover carro. Verifique os logs para mais detalhes.');
            // Loga o erro no console para depuração.
            console.log(error);
            // Retorna false indicando que a remoção falhou.
            return false;
        }
    }

    /**
     * Atualiza os dados de um carro no banco de dados.
     * 
     * Esta função atualiza as informações de um carro na tabela carro com base nos valores do objeto 
     * Carro fornecido. Ela verifica se a operação foi bem-sucedida e retorna um valor booleano.
     * 
     * @param {Carro} carro - Objeto contendo os dados atualizados do carro. O objeto deve possuir os métodos 
     *                        getMarca(), getModelo(), getAno(), getCor() e getIdCarro() para acessar 
     *                        as informações do carro.
     * @returns {Promise<boolean>} - Retorna true se os dados do carro foram atualizados com sucesso ou false 
     *                                caso contrário. Em caso de erro, a função trata a exceção e retorna false.
     * 
     * @throws {Error} - Exibe uma mensagem de erro no console e os detalhes do erro caso a atualização falhe.
     */
    static async atualizarCarro(carro: Carro): Promise<boolean> {
        try {
            // Cria uma query SQL para atualizar os dados do carro no banco de dados.
            const queryUpdateCarro = `UPDATE carro SET
                                    marca = '${carro.getMarca()}',
                                    modelo = '${carro.getModelo()}',
                                    ano = ${carro.getAno()},
                                    cor = '${carro.getCor()}'
                                  WHERE id_carro = ${carro.getIdCarro()};`;

            // Executa a query no banco de dados e armazena a resposta.
            const respostaBD = await database.query(queryUpdateCarro);

            // Verifica se alguma linha foi alterada pela operação de atualização.
            if (respostaBD.rowCount != 0) {
                // Loga uma mensagem de sucesso no console indicando que o carro foi atualizado.
                console.log(`Carro atualizado com sucesso! ID: ${carro.getIdCarro()}`);
                // Retorna true para indicar sucesso na atualização.
                return true;
            }

            // Retorna false se nenhuma linha foi alterada (atualização não realizada).
            return false;

        } catch (error) {
            // Exibe uma mensagem de erro no console caso ocorra uma exceção.
            console.log('Erro ao atualizar o carro. Verifique os logs para mais detalhes.');
            // Loga o erro no console para depuração.
            console.log(error);
            // Retorna false indicando que a atualização falhou.
            return false;
        }
    }
}

