import {app} from './main';
import { AppDataSource } from './db/database';

const port = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('📦 Database initialized');
    app.listen(port, () => {
      console.log(`🚀 Server is listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('❌ DB initialization failed:', error);
  });