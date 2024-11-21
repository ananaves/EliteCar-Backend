import { DatabaseModel } from "./DatabaseModel";

const database = new DatabaseModel().pool;

/**
 * Classe que represeta um Pedido de Venda
 */
export class PedidoVenda {

    /* Atributos */
    /* Id do pedido */
    private idPedido: number = 0;
    /* Id do carro */
    private idCarro: number;
    /* Id do cliente */
    private idCliente: number;
    /* Data do pedido */
    private dataPedido: Date;
    /* Valor do pedido */
    private valorPedido: number;

    /**
     * Construtor da Classe PedidoVenda
     * 
     * @param idCarro Identificador do carro
     * @param idCliente Identificador do cliente
     * @param dataPedido Data do pedido
     * @param valorPedido Valor do pedido
     */

    constructor(
        idCarro: number,
        idCliente: number,
        dataPedido: Date,
        valorPedido: number
    ) {
        this.idCarro = idCarro;
        this.idCliente = idCliente;
        this.dataPedido = dataPedido;
        this.valorPedido = valorPedido;
    }

    /* Métodos get e set */
    /**
     * Recupera o identificador do pedido
     * @returns o identificador do pedido
     */
    public getIdPedido(): number {
        return this.idPedido;
    }

    /**
     * Atribui um valor ao identificador do pedido
     * @param idPedido novo identificado do pedido
     */
    public setIdPedido(idPedido: number): void {
        this.idPedido = idPedido;
    }
    /**
     * Recupera o Id do carro
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
     * Retorna o Id do cliente
     * 
     * @returns {number} Id do cliente
     */
    public getIdCliente(): number {
        return this.idCliente;
    }

    /**
     * * Atribui um valor ao identificador do cliente
     * @param idCliente - O id do cliente a ser definido.
     */
    public setIdCliente(idCliente: number): void {
        this.idCliente = idCliente;
    }

    /**
     * Retorna a data do pedido
     * 
     * @returns {Date} data do pedido.
     */
    public getDataPedido(): Date {
        return this.dataPedido;
    }

    /**
     * Define a data do pedido
     * 
     * @param dataPedido -  Data do pedido a ser definido.
     */
    public setDataPedido(dataPedido: Date): void {
        this.dataPedido = dataPedido;
    }

    /**
     * Retorna o valor do pedido
     * 
     * @returns {number} valor do pedido
     */
    public getValorPedido(): number {
        return this.valorPedido;
    }

    /**
        * Busca e retorna uma lista de pedidos de venda do banco de dados.
        * @returns Um array de objetos do tipo `PedidoVenda` em caso de sucesso ou `null` se ocorrer um erro durante a consulta.
        * 
        * - A função realiza uma consulta SQL para obter todos os registros da tabela "pedido_venda".
        * - Os dados retornados são utilizados para instanciar objetos da classe `PedidoVenda`.
        * - Cada pedido de venda instanciado é adicionado a uma lista que será retornada ao final da execução.
        * - Caso ocorra uma falha na consulta ao banco, a função captura o erro, exibe uma mensagem no console e retorna `null`.
        */
    static async listagemPedidos(): Promise<Array<PedidoVenda> | null> {
        const listaDePedidos: Array<PedidoVenda> = [];

        try {
            const querySelectPedidos = `SELECT * FROM pedido_venda;`;
            const respostaBD = await database.query(querySelectPedidos);

            respostaBD.rows.forEach((linha) => {
                const novoPedidoVenda = new PedidoVenda(
                    linha.id_carro,
                    linha.id_cliente,
                    linha.data_pedido,
                    parseFloat(linha.valor_pedido)
                );

                novoPedidoVenda.setIdPedido(linha.id_pedido);


                listaDePedidos.push(novoPedidoVenda);
            });

            return listaDePedidos;
        } catch (error) {
            console.log('Erro ao buscar lista de pedidos');
            return null;
        }
    }

    /**
 * Realiza o cadastro de um pedido de venda no banco de dados.
 * 
 * Esta função recebe um objeto do tipo `PedidoVenda` e insere seus dados (marca, modelo, ano e cor)
 * na tabela `pedido_venda` do banco de dados. O método retorna um valor booleano indicando se o cadastro 
 * foi realizado com sucesso.
 * @returns {Promise<boolean>} - Retorna `true` se o Pedido de Venda foi cadastrado com sucesso e `false` caso contrário.
  Em caso de erro durante o processo, a função trata o erro e retorna `false`.
 * @throws {Error} - Se ocorrer algum erro durante a execução do cadastro, uma mensagem de erro é exibida
  no console junto com os detalhes do erro.
 */
    static async cadastroPedidoVenda(pedido_venda: PedidoVenda): Promise<boolean> {
        try {
            // query para fazer insert de um Pedido de Venda no banco de dados
            const queryInsertPedidoVenda = `INSERT INTO pedido_venda (id_carro, id_cliente, data_pedido, valor_pedido)
                                                VALUES
                                                (${pedido_venda.getIdCarro()}, 
                                                ${pedido_venda.getIdCliente()}, 
                                                '${pedido_venda.getDataPedido()}',
                                                ${pedido_venda.getValorPedido()})
                                                RETURNING id_pedido;`;

            // executa a query no banco e armazena a resposta
            const respostaBD = await database.query(queryInsertPedidoVenda);

            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Pedido de Venda cadastrado com sucesso! ID do Pedido: ${respostaBD.rows[0].id_pedido}`);
                // true significa que o cadastro foi feito
                return true;
            }
            // false significa que o cadastro NÃO foi feito.
            return false;

            // tratando o erro
        } catch (error) {
            // imprime outra mensagem junto com o erro
            console.log('Erro ao cadastrar o pedido. Verifique os logs para mais detalhes.');
            // imprime o erro no console
            console.log(error);
            // retorno um valor falso
            return false;
        }
    }
    /**
     * Remove um pedido de venda do banco de dados com base no ID fornecido.
     * 
     * Esta função executa uma query para excluir um registro na tabela `pedido_venda` que corresponda 
     * ao ID fornecido. Retorna `true` se a remoção for bem-sucedida (linhas afetadas) ou `false` caso contrário.
     * 
     * @param {number} idPedido - ID do pedido de venda a ser removido.
     * @returns {Promise<boolean>} - Retorna `true` se o pedido foi removido com sucesso, `false` caso contrário.
     * 
     * @throws {Error} - Caso ocorra um erro na execução da query, ele será logado no console.
     */
    static async removerPedido(idPedido: number): Promise<boolean> {
        try {
            // Query para deletar o pedido pelo ID
            const queryDeletePedido = `DELETE FROM pedido_venda 
                                        WHERE id_pedido = ${idPedido}`;

            // Executa a query no banco de dados
            const respostaBD = await database.query(queryDeletePedido);

            // Verifica se alguma linha foi afetada pela query
            if (respostaBD.rowCount != 0) {
                // Loga uma mensagem de sucesso no console
                console.log(`Pedido removido com sucesso! ID removido: ${idPedido}`);
                return true; // Retorna `true` para indicar sucesso
            }

            // Retorna `false` se nenhuma linha foi afetada (pedido não encontrado)
            return false;
        } catch (error) {
            // Loga uma mensagem de erro no console em caso de exceção
            console.log('Erro ao remover pedido. Verifique os logs para mais detalhes.');
            // Loga o erro para análise de detalhes
            console.log(error);
            return false; // Retorna `false` para indicar falha na operação
        }
    }

    /**
     * Atualiza os dados de um pedido de venda no banco de dados.
     * 
     * Esta função atualiza os campos de um pedido na tabela `pedido_venda` com base no ID fornecido. 
     * Retorna `true` se a atualização for bem-sucedida (linhas afetadas) ou `false` caso contrário.
     * 
     * @param {PedidoVenda} pedido - Objeto contendo os dados do pedido a serem atualizados.
     * @returns {Promise<boolean>} - Retorna `true` se o pedido foi atualizado com sucesso, `false` caso contrário.
     * 
     * @throws {Error} - Caso ocorra um erro na execução da query, ele será logado no console.
     */
    static async atualizarPedido(pedido: PedidoVenda): Promise<boolean> {
        try {
            // Query para atualizar os dados do pedido no banco de dados
            const queryUpdatePedido = `
                UPDATE pedido_venda SET
                    id_carro = ${pedido.getIdCarro()},
                    id_cliente = ${pedido.getIdCliente()},
                    data_pedido = '${pedido.getDataPedido()}',
                    valor_pedido = ${pedido.getValorPedido()}
                WHERE id_pedido = ${pedido.getIdPedido()}
            `;

            // Executa a query no banco de dados
            const respostaBD = await database.query(queryUpdatePedido);

            // Verifica se alguma linha foi afetada pela query
            if (respostaBD.rowCount != 0) {
                // Loga uma mensagem de sucesso no console
                console.log(`Pedido atualizado com sucesso! ID: ${pedido.getIdPedido()}`);
                return true; // Retorna `true` para indicar sucesso
            }

            // Retorna `false` se nenhuma linha foi afetada (pedido não encontrado)
            return false;
        } catch (error) {
            // Loga uma mensagem de erro com detalhes no console
            console.error(`Erro ao atualizar pedido. ID: ${pedido.getIdPedido()}. Detalhes: ${error}`);
            return false; // Retorna `false` para indicar falha na operação
        }
    }

}