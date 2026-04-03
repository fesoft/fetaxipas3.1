import { clone } from 'src/modules/utils'

export const  empresaMixin = {
  data: () => {
    return {
      options: {      
      }
    }
  },
  methods: {
    getParametros() {
      let select = this.objFields().reduce((acc, cur, i) => {
        acc[i] = cur.name;
        return acc;
      }, []).join(',');
      let params = {
        _select: select
      };
      this.$api.get('/empresa', {params})
      .then(({data}) => {
        this.form = data.resultado[0] || [];
        this.formOld = clone(this.form);
      })
    },
  },
  computed: {
    fieldsList(){
      var list = []
      this.fields.map((item) => item.fields)
        .forEach((value, index, array) => {
          list = Array.prototype.concat(list,value)
        })
      return list
    }
  },
  mounted () {
    this.getParametros();
  }
};
