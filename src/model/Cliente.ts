import { DatabaseModel } from "./DatabaseModel";

const database = new DatabaseModel().pool;

/**
 * Classe que representa o cliente.
 */
export class Cliente {

    /* Atributos */

    /* Identificador do cliente */
    private idCliente: number = 0;
    /* nome do cliente */
    private nome: string;
    /* cpf do cliente  */
    private cpf: number;
    /* telefone do cliente */
    private telefone: number;

    /**
     * Construtor da classe Cliente
     * 
     * @param nome nome do cliente
     * @param cpf  cpf do cliente 
     * @param telefone telefone do cliente
     */

    constructor(
        nome: string,
        cpf: number,
        telefone: number,

    ) {
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;

    }

    /* Métodos get e set */
    /**
     * Recupera o identificador do cliente
     * @returns o identificador do cliente
     */

    public getIdCliente(): number {
        return this.idCliente;
    }

    /**
     * Atribui um valor ao identificador do cliente
     * @param idCliente novo identificado do cliente
     */
    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente;
    }

    /**
     * Retorna o nome no cliente.
     *
     * @returns {string} O nome do cliente .
     */
    public getNome(): string {
        return this.nome;
    }

    /**
     * Define o nome do cliente
     * 
     * @param nome - o nome do cliente a ser definido.
     */
    public setNome(nome: string): void {
        this.nome = nome;
    }

    /**
     * Retorna o cpf do cliente 
     *
     * @returns {number} O cpf do cliente.
     */
    public getCpf(): number {
        return this.cpf;
    }

    /**
     * Define o cpf do cliente.
     *
     * @param cpf - O numero do cpf do cliente
     */
    public setCpf(cpf: number): void {
        this.cpf = cpf;
    }

    /**
     * Retorna o telefone do cliente.
     *
     * @returns O telefone do cliente.
     */
    public getTelefone(): number {
        return this.telefone;
    }

    /**
     * Define o telefone do cliente.
     * 
     * @param telefone - O telefone a ser definido para o cliente.
     */
    public setTelefone(telefone: number): void {
        this.telefone = telefone;
    }

    /**
     * O método listarClientes executa uma consulta SQL para buscar todos os clientes da tabela cliente no banco de dados.
     * @returns todos os clientes encontrados no banco de dados.
     */

    static async listarClientes(): Promise<Array<Cliente> | null> {

        let listaDeClientes: Array<Cliente> = [];

        try {

            const querySelectCliente = `SELECT * FROM cliente;`;

            const respostaBD = await database.query(querySelectCliente);

            respostaBD.rows.forEach((cliente) => {
                let novoCliente = new Cliente(
                    cliente.nome,
                    cliente.cpf,
                    cliente.telefone,

                );

                novoCliente.setIdCliente(cliente.id);

                listaDeClientes.push(novoCliente);

            });

            return listaDeClientes;


        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    /**
     * Realiza o cadastro de um cliente no banco de dados.
     * 
     * Esta função recebe um objeto do tipo `Cliente` e insere seus dados (nome, cpf, telefone)
     * na tabela `cliente` do banco de dados. O método retorna um valor booleano indicando se o cadastro 
     * foi realizado com sucesso.
     * 
     * @param {Cliente} cliente - Objeto contendo os dados do carro que será cadastrado. O objeto `Cliente`
     *                        deve conter os métodos `getNome()`, `getCpf()`, `getTelefone()`
     *                        que retornam os respectivos valores do cliente.
     * @returns {Promise<boolean>} - Retorna `true` se o cliente foi cadastrado com sucesso e `false` caso contrário.
     *                               Em caso de erro durante o processo, a função trata o erro e retorna `false`.
     * 
     * @throws {Error} - Se ocorrer algum erro durante a execução do cadastro, uma mensagem de erro é exibida
     *                   no console junto com os detalhes do erro.
     */
    static async cadastroCliente(cliente: Cliente): Promise<boolean> {
        try {
            // query para fazer insert de um cliente no banco de dados
            const queryInsertCliente = `INSERT INTO cliente (nome, cpf, telefone)
                                        VALUES
                                        ('${cliente.getNome()}', 
                                        '${cliente.getCpf()}', 
                                        '${cliente.getTelefone()}')
                                        RETURNING id_cliente;`;

            // executa a query no banco e armazena a resposta
            const respostaBD = await database.query(queryInsertCliente);

            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Cliente cadastrado com sucesso! ID do cliente: ${respostaBD.rows[0].id_cliente}`);
                // true significa que o cadastro foi feito
                return true;
            }
            // false significa que o cadastro NÃO foi feito.
            return false;

            // tratando o erro
        } catch (error) {
            // imprime outra mensagem junto com o erro
            console.log('Erro ao cadastrar o cliente. Verifique os logs para mais detalhes.');
            // imprime o erro no console
            console.log(error);
            // retorno um valor falso
            return false;
        }
    }

    /*
    * Remove um cliente do banco de dados com base no ID fornecido.
    * 
    * Esta função executa uma query DELETE para excluir um cliente da tabela cliente no banco de dados.
    * Retorna true se a remoção for bem-sucedida (linhas afetadas) ou false caso contrário.
    * 
    * @param {number} idCliente - ID do cliente a ser removido.
    * @returns {Promise<boolean>} - Retorna true se o cliente foi removido com sucesso, false caso contrário.
    * 
    * @throws {Error} - Caso ocorra um erro na execução da query, ele será logado no console.
    */


    static async removerCliente(idCliente: number): Promise<boolean> {
        try {
            // Query para deletar o cliente pelo ID
            const queryDeleteCliente = `DELETE FROM cliente WHERE id_cliente = ${idCliente}`;

            // Executa a query no banco de dados e armazena a resposta
            const respostaBD = await database.query(queryDeleteCliente);

            // Verifica se alguma linha foi afetada pela query (cliente encontrado e removido)
            if (respostaBD.rowCount != 0) {
                // Exibe mensagem de sucesso no console
                console.log(`Cliente removido com sucesso! ID removido: ${idCliente}`);
                return true; // Retorna true para indicar sucesso
            }

            // Retorna false se nenhuma linha foi afetada (cliente não encontrado)
            return false;
        } catch (error) {
            // Exibe uma mensagem de erro caso ocorra uma exceção
            console.log(`Erro ao remover cliente. Verifique os logs para mais detalhes`);
            // Loga o erro no console para depuração
            console.log(error);
            return false; // Retorna false para indicar falha na operação
        }
    }

    /**
     * Atualiza os dados de um cliente no banco de dados.
     * 
     * Esta função executa uma query UPDATE para atualizar os dados do cliente na tabela cliente.
     * Retorna true se a atualização for bem-sucedida (linhas afetadas) ou false caso contrário.
     * 
     * @param {Cliente} cliente - Objeto contendo os dados do cliente a serem atualizados.
     * @returns {Promise<boolean>} - Retorna true se o cliente foi atualizado com sucesso, false caso contrário.
     * 
     * @throws {Error} - Caso ocorra um erro na execução da query, ele será logado no console.
     */
    static async atualizarCliente(cliente: Cliente): Promise<boolean> {
        try {
            // Query para atualizar os dados do cliente no banco de dados
            const queryUpdateCliente = `UPDATE cliente SET
                                       nome = '${cliente.getNome()}',
                                       cpf = '${cliente.getCpf()}',
                                       telefone = '${cliente.getTelefone()}'
                                       WHERE id_cliente = ${cliente.getIdCliente()};`;

            // Executa a query no banco de dados e armazena a resposta
            const respostaBD = await database.query(queryUpdateCliente);

            // Verifica se alguma linha foi alterada pela query (atualização bem-sucedida)
            if (respostaBD.rowCount != 0) {
                // Exibe uma mensagem de sucesso no console indicando que o cliente foi atualizado
                console.log(`Cliente atualizado com sucesso! ID: ${cliente.getIdCliente()}`);
                return true; // Retorna true para indicar sucesso na atualização
            }

            // Retorna false se nenhuma linha foi alterada (atualização não realizada)
            return false;
        } catch (error) {
            // Exibe uma mensagem de erro no console caso ocorra uma exceção
            console.log('Erro ao atualizar o cliente. Verifique os logs para mais detalhes.');
            // Loga o erro no console para depuração
            console.log(error);
            return false; // Retorna false para indicar falha na operação
        }
    }
}