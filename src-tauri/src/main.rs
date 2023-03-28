// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Board {
    columns: Vec<Column>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Column {
    id: i64,
    title: String,
    cards: Vec<Card>
}

impl Column {
    pub fn new(id: i64, title: &str) -> Self {
        Column {
            id,
            title: title.to_string(),
            cards: Vec::new(),
        }
    }

    pub fn add_card(&mut self, card: Card) {
        self.cards.push(card);
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Card {
    id: i64,
    title: String,
    description: Option<String>
}

impl Card {
    pub fn new(id: i64, title: &str, description: Option<&str>) -> Self {
        Card {
            id,
            title: title.to_string(),
            description: description.map(ToString::to_string),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CardPos {
    #[serde(rename = "columnId")]
    column_id: i64,
    position: i64,
}

#[tauri::command]
fn get_board() -> Result<Board, String> {
    let mut col0 = Column::new(0, "バックログ");
    col0.add_card(Card::new(0, "看板ボードを追加する", Some("React-kanbanを使用する")));
    let col1 = Column::new(1, "開発中");
    let board = Board { columns: vec![col0, col1]};
    Ok(board)
}

#[tauri::command]
async fn handle_add_card(card: Card, pos: CardPos) -> Result<(), String> {
    // IPCで受信したデータをデバッグ表示する
    println!("handle_add_card --------");
    dbg!(&card);
    dbg!(&pos);
    Ok(())
}

#[tauri::command]
async fn handle_remove_card(column: Column, card: Card) -> Result<(), String> {
    // IPCで受信したデータをデバッグ表示する
    println!("handle_remove_card --------");
    dbg!(&column);
    dbg!(&card);
    Ok(())
}

#[tauri::command]
async fn handle_move_card(card: Card, from: CardPos, to: CardPos) -> Result<(), String> {
    // IPCで受信したデータをデバッグ表示する
    println!("handle_move_card --------");
    dbg!(&card);
    dbg!(&from);
    dbg!(&to);
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_board,
            handle_add_card,
            handle_remove_card,
            handle_move_card
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
