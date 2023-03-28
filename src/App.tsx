// react-kanbanをインポートする
// 型定義ファイル（.d.ts）がないため、`@ts-ignore`を指定することで
// TypeScriptのエラーを抑止している

// @ts-ignore
import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import { invoke } from '@tauri-apps/api'
import { useState, useEffect } from 'react';

type TBoard = {
  columns: [TColumn];
}

type TColumn = {
  id: number;
  title: string;
  cards: [TCard];
}

type TCard = {
  id: number;
  title: string;
  description: string | undefined;
}

type TMovedFrom = {
  fromColumnId: number;
  fromPosition: number;
}

type TMovedTo = {
  toColumnId: number;
  toPosition: number;
}

class CardPos {
  columnId: number;
  position: number;

  constructor(columnId: number, position: number) {
    this.columnId = columnId;
    this.position = position;
  }
}

async function handleAddCard(board: TBoard, column: TColumn, card: TCard) {
  const pos = new CardPos(column.id, 0);
  // IPCでCOreプロセスのhandle_add_cardを呼ぶ
  await invoke<void>("handle_add_card", {"card": card, "pos":  pos })
}

async function handleMoveCard(board: TBoard, card: TCard, from: TMovedFrom, to: TMovedTo) {
  const fromPos = new CardPos(from.fromColumnId, from.fromPosition);
  const toPos = new CardPos(to.toColumnId, to.toPosition);
  await invoke<void>("handle_move_card", { "card": card, "from": fromPos, "to": toPos });
}

async function handleRemoveCard(board: TBoard, column: TColumn, card: TCard) {
  await invoke<void>("handle_remove_card", { "card": card, "column": column });
}

// かんばんボードに最初に表示するデータを作成する
const board = {
  columns: [
    {
      id: 0,
      title: 'バックログ',
      cards: [
        {
          id: 0,
          title: 'かんばんボードを追加する',
          description: 'react-kanbanを使用する'
        },
      ]
    },
    {
      id: 1,
      title: '開発中',
      cards: []
    }
  ]
}

// かんばんボードコンポーネントを表示する
function App() {
  const [board, setBoard] = useState<TBoard | null>(null);

  useEffect(() => {
    (async () => {
      // IPCでCoreプロセスのget_boardを呼ぶ
      const board = await invoke<TBoard>("get_board", {})
        .catch(err => {
          console.error(err);
          return null;
        })
      console.debug(board);
      setBoard(board);
    })();
  }, []);

  return (
    <>
      {board != null &&
        <Board
          // ボードの初期データ
          initialBoard={board}
          // カードの追加を許可（トップに「＋」ボタンを表示）
          allowAddCard={{ on: "top" }}
          // カードの削除を許可
          allowRemoveCard
          // カラム（カードのグループ）のドラッグをオフにする
          disableColumnDrag
          // 新しいカードの作成時、idに現在時刻の数値表現をセットする
          onNewCardConfirm={(draftCard: any) => ({
            id: new Date().getTime(),
            ...draftCard
          })}
          // 新しいカードが作成されたら、カード等の内容をコンソールに表示する
          onCardNew={handleAddCard}
          // カードがドラッグされたら、カード等の内容をコンソールに表示する
          onCardDragEnd={handleMoveCard}
          // カードが削除されたら、カード等の内容をコンソールに表示する
          onCardRemove={handleRemoveCard}
        />
      }
    </>
  )
}

export default App;