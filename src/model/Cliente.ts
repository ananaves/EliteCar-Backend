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
}