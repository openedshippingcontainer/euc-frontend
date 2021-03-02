import { withStyle } from "baseui";
import {
  StyledTableBodyCell,
  StyledTableBodyRow
} from "baseui/table-semantic";

export const TableCell = withStyle(StyledTableBodyCell, {
  verticalAlign: "middle"
});

export const TableRow = withStyle(StyledTableBodyRow, ({ $theme }) => ({
  ":nth-child(even)": {
    backgroundColor: $theme.colors.backgroundSecondary,
    ":hover": {
      backgroundColor: $theme.colors.backgroundTertiary
    }
  },
  ":hover": {
    backgroundColor: $theme.colors.backgroundTertiary
  }
}));

export {
  StyledRoot as TableRoot,
  StyledTable as Table,
  StyledTableBody as TableBody
} from "baseui/table-semantic";