
      try {
        function triggerDiscountsV2ToStore() {
          window.SOLID = window.SOLID || {};
          window.SOLID.discountsV2 = window.SOLID.discountsV2 || [];
          
          if (window.SOLID.store && window.SOLID.store.dispatch) {
            window.SOLID.store.dispatch("discountsV2", window.SOLID.discountsV2);
            window.SOLID.store.dispatch("esDiscountsData", []);
          }
        }
        triggerDiscountsV2ToStore()
      } catch(e) {
        console.log("=============================== START ERROR =================================")
        console.log(e)
        console.log("===============================  END ERROR  =================================")
      }
    