import React, { Component } from 'react';
import { Card, CardTitle } from 'react-materialize';

import style from './HomeContents.css';

const HomeContents = ( props )=>{
  return (
    <Card className='HomeContents small'
      header={ <CardTitle image='/images/home/back.png'>Hi, I'm battle-code!!!</CardTitle> }
      actions={[<a href='#'>This is a Link</a>]}>
      알고리즘 문제 풀이 웹사이트.
    </Card>
  );
}

export default HomeContents