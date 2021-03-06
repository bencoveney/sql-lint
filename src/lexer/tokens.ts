export const TOKENS = {
  keyword: [
    "select",
    "delete",
    "update",
    "from",
    "where",
    "set",
    "join",
    "having",
    "limit",
    "else",
    "if",
    "begin"
  ],

  comment: ["#", "--"],
  boolean: ["true", "false", "null"],
  conditional: ["and", "or"],
  operator: ["+", "-", "/"]
};

export enum Types {
  Keyword = 'keyword',
  TableReference = 'table_reference',
  DropItem = 'drop_item',
  Unidentified = '???'
}

export enum Keyword {
  Begin = "begin",
  Create = "create",
  Delete = "delete",
  Drop = "drop",
  Else = "else",
  From = "from",
  Having = "having",
  If = "if",
  Insert = 'insert',
  Join = "join",
  Limit = "limit",
  Select = "select",
  Set = "set",
  Update = "update",
  Use = "use",
  Where = "where"
}
