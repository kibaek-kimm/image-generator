import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  container: {
    marginTop: 30,
    maxHeight: 350,
    overflow: 'auto'
  },
  table: {
    minWidth: 300,
    tableLayout: 'fixed'
  },
  th: [
    { width: 50 },
    { width: 50 },
    { width: 200 }
  ],
  failCell: {
    color: '#ff5555',
  },
  defaultCell: {
    color: '#02af58',
  },
});

const createData = (color, status, reason = null) => {
  return { color, status, reason };
}

const rows = [
  createData('#000', 'success'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
  createData('#ff0000', 'failure', '데이터 에러'),
];

export default function SimpleTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.container}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.th[0]}>Color</TableCell>
            <TableCell className={classes.th[1]}>Status</TableCell>
            <TableCell className={classes.th[2]}>Reason</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.color}>
              <TableCell component="th" scope="row">
                <div style={{
                  width: '20px',
                  height: '20px',
                  display: 'inline-block',
                  marginRight: '5px',
                  verticalAlign: 'middle',
                  backgroundColor: row.color
                }}/>
                {row.color}
              </TableCell>
              <TableCell className={row.status === 'failure' ? classes.failCell : classes.defaultCell}>{row.status}</TableCell>
              <TableCell>{row.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}