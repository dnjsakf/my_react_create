import express from 'express';
import mysql from 'mysql';
import bcrypt from 'bcryptjs';

const router = express.Router();
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ( process.platform === 'linux' ? '1111' : 'wjddns1' ),
  database: 'battlecode'
});
conn.connect((error)=>{
  if( error ) throw error;
  console.log( '[mysql-connection] - userstate' );
});

/**
 * TODO: 회원정보 추가
 * 많이 쓸일은 없을 듯 하다.
 * 그래도 기본적인 기능만 구현해두자.
 */

router.put('/insert', (req, res)=>{
  return res.status(200).json({
    success: true
  });
});

/**
 * TODO: 회원정보 변경
 * 현재는 사용자의 이름, 비밀번호만 변경가능하도록 하자.
 * params도 추가해서 환경설정 정보도 추가하도록 해야겠네
 * 
 * mode: ['setting', 'default', 'restrict']
 * 
 */
router.post('/update/:mode', (req, res)=>{
  const session = req.session;
  const mode = req.params.mode;
  const username = req.body.username;
  console.log(mode)
  
  if( typeof session.user === 'undefined' ){
    return res.status(404).json({
      error: 'Invliad connect',
      code: 0
    });
  }
  if( session.user.username !== req.body.username ){
    return res.status(403).json({
      error: 'No matched username',
      code: 1
    });
  }

  switch( mode ){
    case 'default':
      const updateDefault = {};
      // 유효성 검사도 해줘야될듯?
      if( typeof req.body.displayName !== 'undefined'){
        updateDefault.name = req.body.displayName;
      }
      if( typeof req.body.password !== 'undefined' ){
        updateDefault.password = bcrypt.hash(req.body.password, 8);
      }
      if( Object.keys(updateDefault).length === 0){
        return res.status(400).json({
          error: 'Not found data',
          code: 2
        });
      }

      const sqlDefault = `UPDATE member SET ? WHERE email = ?`;
      conn.query(sqlDefault, [ updateDefault, username ], ( error, updated)=>{
        if(error) throw error;
        // 아 기억이 안난다.ㅇ아아아아.
        if( updated.changedRows === 0){
          return res.status(400).json({
            error: 'no chagned',
            code: 4
          });
        }

        if( typeof updateDefault.name !== 'undefined' ){
          session.user.displayName = updateDefault.name;
        }
        return res.status(200).json({
          success: true
        });
      });
      break;
    case 'setting':
      const updateSetting = {};
      // 에디터_테마
      if( typeof req.body.theme !== 'undefined'){
        updateSetting.setting_editor_theme = req.body.theme;
      }
      // 에디터_기본언어
      if( typeof req.body.language !== 'undefined' ){
        updateSetting.setting_editor_language = req.body.language;
      }
      // 에디터_폰트
      if( typeof req.body.font !== 'undefined'){
        updateSetting.setting_editor_font = req.body.font;
      }
      // 에디터_폰트사이즈
      if( typeof req.body.fontSize !== 'undefined' ){
        updateSetting.setting_editor_fontsize = req.body.fontSize;
      }

      if( Object.keys(updateSetting).length === 0){
        return res.status(400).json({
          error: 'Not found data',
          code: 2
        });
      }
      const sqlSetting = `UPDATE member SET ? WHERE email = ?`;
      conn.query( sqlSetting, [updateSetting, username], (error, updated )=>{
        if(error) throw error;
        if( updated.changedRows === 0){
          return res.status(400).json({
            error: 'no chagned',
            code: 4
          });
        }
        
        // 업데이트에 성공하면 session change
        if( typeof updateSetting.setting_editor_theme !== 'undefined'){
          session.user.editor.editorTheme = updateSetting.setting_editor_theme;
        }
        if( typeof updateSetting.setting_editor_language !== 'undefined'){
          session.user.editor.editorLanguage = updateSetting.setting_editor_language;
        }
        if( typeof updateSetting.setting_editor_font !== 'undefined'){
          session.user.editor.editorFont = updateSetting.setting_editor_font;
        }
        if( typeof updateSetting.setting_editor_fontsize !== 'undefined'){
          session.user.editor.editorFontSize = updateSetting.setting_editor_fontsize;
        }

        return res.status(200).json({
          success: true
        });
      });
      break;
      

    case 'restrict':
      return res.status(500).json({
        error: 'Implement not yet',
        code: 99
      });
      break;
    default:
      return res.status(403).json({
        error: 'undefined mode',
        code: 4
      });
      break;
    }
});


/**
 * TODO: 회원탈퇴
 */
router.delete('/delete', (req, res)=>{
  console.log('[delete]', req.query.email );  
  const sqlDelete = `DELETE FROM member WHERE ?`;
  conn.query(sqlDelete, [{ email: req.query.email }] ,(error, result)=>{
    if(error) throw error;
    // TODO: result 
    console.log('[delete]', result);
    return res.status(200).json({
      success: true
    });
  });
});

export default router;