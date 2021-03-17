import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes:{
            dark: {
                primary: colors.blue.lighten3,
                secondary: colors.red.darken1,
                accent: colors.red.black,
                error: colors.red.accent3,
            },
        }
    },
});
