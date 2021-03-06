import { extractTableReference } from "../../../lexer/lexer";
import { Query } from "../../../reader/query";
import { CheckerResult } from "../../checkerResult";
import { IChecker } from "../../interface";
import { Types } from "../../../lexer/tokens";
import { sprintf } from "sprintf-js";

class TableNotFound implements IChecker {

  public message = "Table '%s' does not exist in database '%s'.";

  public tables: string[];
  constructor(tables: any[]) {
    this.tables = this.cleanTables(tables);
  }

  public check(query: Query): CheckerResult {
    for (const line of query.lines) {
      for (const token of line.tokens) {
        if (token[0] === Types.TableReference) {
          const reference = extractTableReference(token[1]);

          if (
            !this.tables.includes(reference.table) &&
            reference.table !== "*"
          ) {
            return new CheckerResult(
              line.num,
              sprintf(this.message, reference.table, reference.database)
            );
          }
        }
      }
    }

    return new CheckerResult(0, "");
  }

  private cleanTables(tables: any): string[] {
    const cleanTables: string[] = [];
    for (const obj of tables) {
      const cleanTable = (<any>Object).values(obj)[0];
      if (cleanTable.length > 0) {
        cleanTables.push(cleanTable);
      }
    }
    return cleanTables;
  }
}

export { TableNotFound };
