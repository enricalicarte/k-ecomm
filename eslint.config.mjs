import { defineConfig } from "eslint/config";
import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';
import next from "eslint-config-next";

export default defineConfig([
  {
    ignores: ['dist/**/*'] 
  },
  {
    extends: [...next]
  },
  firebaseRulesPlugin.configs['flat/recommended']
]);
