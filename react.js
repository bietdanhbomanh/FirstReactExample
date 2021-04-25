const userLocalStorage = {
    name: 'DATA_GAME',
    set(object) {
        localStorage.setItem(this.name, JSON.stringify(object));
    },
    get() {
        const startObject = {
            history: [
                {
                    squares: Array(9).fill(null),
                },
            ],
            xIsNext: true,
            step: 0,
        };
        return JSON.parse(localStorage.getItem(this.name)) || startObject;
    },
};

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function Board(props) {
    function renderSquare(i) {
        return <Square value={props.squares[i]} onClick={() => props.onClick(i)} />;
    }

    return (
        <div>
            <div className="board-row">
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
            </div>
            <div className="board-row">
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
            </div>
            <div className="board-row">
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
            </div>
        </div>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = userLocalStorage.get();
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.step + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (findTheWiiner(squares) || squares[i]) {
            return;
        }
        const xIsNext = this.state.xIsNext;
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({ history: history.concat([{ squares }]), xIsNext: !xIsNext, step: history.length });
        userLocalStorage.set(this.state);
    }

    jumTo(step) {
        this.setState({ step, xIsNext: step % 2 === 0 });
        userLocalStorage.set(this.state);
    }

    render() {
        userLocalStorage.set(this.state);
        const xIsNext = this.state.xIsNext;
        const history = this.state.history;
        const current = history[this.state.step];
        const squares = current.squares;

        const winner = findTheWiiner(squares);
        const status = winner
            ? 'The winner is ' + winner
            : squares.every((ele) => ele) && !winner
            ? 'Draw, please play again'
            : xIsNext
            ? 'Turn of X'
            : 'Turn of O';

        const moves = history.map((moves, step) => {
            const desc = step ? 'Step #' + step : 'Start game';
            return (
                <li key={step}>
                    <button onClick={() => this.jumTo(step)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={squares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.querySelector('#root'));

function findTheWiiner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}
