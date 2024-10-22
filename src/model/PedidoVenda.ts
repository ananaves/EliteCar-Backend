import { DatabaseModel } from "./DatabaseModel";

const database = new DatabaseModel().pool;
/**
 * Classe que representa um PedidoVenda.
 */
export class PedidoVenda {

    /* Atributos */

    /* Identificador do Pedido */
    private idPedidoVenda: number = 0;
    /* Identificador do carro */
    private idCarro: number = 0;
    /* Identificador do cliente */
    private idCliente: number = 0;
    /* data do Pedido */
    private dataPedido: Date;
    /* valor do pedido */
    private valorPedido: number;
    setIdPedidoVenda: any;

    /**
     * Construtor da classe PedidoVenda.
     * @param idCarro identificador do carro
     * @param idCliente identificador do cliente
     * @param dataPedido Marca do carro
     * @param valorPedido Modelo do carro
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
     * Retorna a data do Pedido.
     *
     * @returns {Date} A data do pedido.
     */
    public getdataPedido(): Date {
        return this.dataPedido;
    }

    /**
     * Define a data do pedido.
     * 
     * @param dataPedido - A data do pedido a ser definida.
     */
    public setdataPedido(dataPedido: Date): void {
        this.dataPedido = dataPedido;
    }

    /**
     * Retorna o valor do pedido.
     *
     * @returns {number} O valor do pedido.
     */
    public getvalorPedido(): number {
        return this.valorPedido;
    }

    /**
     * Define o valor do pedido.
     *
     * @param valorPedido - O numero do valor do pedido.
     */
    public setvalorpedido(valorPedido: number): void {
        this.valorPedido = valorPedido;
    }

    /**
     * O método listarCPedidosVendas executa uma consulta SQL para buscar todos os pedidos e vendas da tabela pedido_vendas no banco de dados.
     * @returns todos os pedidos e vendas encontrados no banco de dados.
     */

    static async listarPedidosVenda(): Promise<Array<PedidoVenda> | null> {

        let listaDePedidoVenda: Array<PedidoVenda> = [];

        try {

            const querySelectPedidoVenda = `SELECT * FROM pedido_venda;`;

            const respostaBD = await database.query(querySelectPedidoVenda);

            respostaBD.rows.forEach((pedido_venda) => {
                let novoPedidoVenda = new PedidoVenda(
                    pedido_venda.id_carro,
                    pedido_venda.id_cliente,
                    pedido_venda.data_pedido,
                    pedido_venda.valor_pedido,
                );

                novoPedidoVenda.setIdPedidoVenda(pedido_venda.id);

                listaDePedidoVenda.push(novoPedidoVenda);

            });

            return listaDePedidoVenda;


        } catch (error) {
            console.log(`Erro ao acessar o modelo: ${error}`);
            return null;
        }
    }

    /**
     * Realiza o cadastro de um Pedido e Venda no banco de dados.
     * 
     * Esta função recebe um objeto do tipo `PedidoVenda` e insere seus dados (id_carro, id_cliente, data_pedido, valor_pedido)
     * na tabela `pedido_venda` do banco de dados. O método retorna um valor booleano indicando se o cadastro 
     * foi realizado com sucesso.
     * @param {PedidoVenda} pedido_venda - Objeto contendo os dados do pedidoVenda que será cadastrado. O objeto `PedidoVenda`
    deve conter os métodos `getIdCarro()`, `getIdCliente()`, `getDataPedido(), `getValorPedido`
    que retornam os respectivos valores do pedidoVenda.
     * @returns {Promise<boolean>} - Retorna `true` se o PedidoVenda foi cadastrado com sucesso e `false` caso contrário.
      Em caso de erro durante o processo, a função trata o erro e retorna `false`.
     * @throws {Error} - Se ocorrer algum erro durante a execução do cadastro, uma mensagem de erro é exibida
      no console junto com os detalhes do erro.
     */
    static async cadastroPedidoVenda(pedido_venda: PedidoVenda): Promise<boolean> {
        try {
            // query para fazer insert de um pedidoVenda no banco de dados
            const queryInsertPedidoVenda = `INSERT INTO pedido_venda (id_carro, id_cliente, data_pedido, valor_pedido)
                                        VALUES
                                        ('${pedido_venda.getIdCarro()}', 
                                        '${pedido_venda.getIdCliente()}', 
                                        '${pedido_venda.getdataPedido()}',
                                        '${pedido_venda.getvalorPedido()}')
                                        RETURNING id_PedidoVenda;`;

            // executa a query no banco e armazena a resposta
            const respostaBD = await database.query(queryInsertPedidoVenda);

            // verifica se a quantidade de linhas modificadas é diferente de 0
            if (respostaBD.rowCount != 0) {
                console.log(`Pedido e Venda cadastrado com sucesso! ID do PedidoVenda: ${respostaBD.rows[0].id_PedidoVenda}`);
                // true significa que o cadastro foi feito
                return true;
            }
            // false significa que o cadastro NÃO foi feito.
            return false;

            // tratando o erro
        } catch (error) {
            // imprime outra mensagem junto com o erro
            console.log('Erro ao cadastrar o Pedido e Venda. Verifique os logs para mais detalhes.');
            // imprime o erro no console
            console.log(error);
            // retorno um valor falso
            return false;
        }
    }

}