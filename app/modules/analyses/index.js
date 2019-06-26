const BBAValue = require('../../models/medicine/BBAValue');
const GBAValue = require('../../models/medicine/GBAValue');
const GUAValue = require('../../models/medicine/GUAValue');
const BBAIndicators = require('../../models/medicine/BBAIndicators');
const GBAIndicators = require('../../models/medicine/GBAIndicators');
const GUAIndicators = require('../../models/medicine/GUAIndicators');

const Module = require('../../core/module');
const Auth = require('../auth');

const validate = require('./validation');

class Analyses extends Module {
  
  async createBBA(ctx) {
    await BBAValue.query().insert(ctx.body);
  
    ctx.status = 200;
  }
  
  async updateBBA(ctx) {
    const { id } = ctx.query;
  
    await BBAValue.query().updateAndFetchById(id, ctx.body);
  
    ctx.status = 200;
  }
  
  async deleteBBA(ctx) {
    const { id } = ctx.query;
  
    await BBAValue.query().deleteById(id);
  
    ctx.status = 200;
  }
  
  async createGUA(ctx) {
    await GUAValue.query().insert(ctx.body);
  
    ctx.status = 200;
  }
  
  async updateGUA(ctx) {
    const { id } = ctx.query;
  
    await GUAValue.query().updateAndFetchById(id, ctx.body);
  
    ctx.status = 200;
  }
  
  async deleteGUA(ctx) {
    const { id } = ctx.query;
  
    await GUAValue.query().deleteById(id);
  
    ctx.status = 200;
  }
  
  async createGBA(ctx) {
    await GBAValue.query().insert(ctx.body);
  
    ctx.status = 200;
  }
  
  async updateGBA(ctx) {
    const { id } = ctx.query;
  
    await GBAValue.query().updateAndFetchById(id, ctx.body);
  
    ctx.status = 200;
  }
  
  async deleteGBA(ctx) {
    const { id } = ctx.query;
  
    await GBAValue.query().deleteById(id);
  
    ctx.status = 200;
  }

  getResult (value, indicators) {
    const response = [];

    for (let i = 0; i < indicators.length; i += 1) {
      if(value[i].sex === 'MAN') {
        if (value[i].value > indicators[i].limits_max_man) {
          response.push(indicators[i].ifMax);
        }

        if (value[i].value < indicators[i].limits_min_man) {
          response.push(indicators[i].ifMin);
        }
      } else {
        if (value[i].value > indicators[i].limits_max_woman) {
          response.push(indicators[i].ifMax);
        }

        if (value[i].value < indicators[i].limits_min_woman) {
          response.push(indicators[i].ifMin);
        }
      }
    }

    return response;
  }

  async getBBAAnalysisResult(ctx) {
    const { value } = ctx.body;
    
    const indicators = await BBAIndicators.query().findByIds(value.map(({ id }) => id));
    const response = this.getResult(value, indicators);
    
    ctx.status = 200;
    ctx.body = { response };
  }

  async getGBAAnalysisResult(ctx) {
    const { value } = ctx.body;
    
    const indicators = await GBAIndicators.query().findByIds(value.map(({ id }) => id));    
    const response = this.getResult(value, indicators);
  
    ctx.status = 200;
    ctx.body = { response };
  }

  async getGUAAnalysisResult(ctx) {
    const { value } = ctx.body;
    
    const indicators = await GUAIndicators.query().findByIds(value.map(({ id }) => id));    
    const response = this.getResult(value, indicators);
  
    ctx.status = 200;
    ctx.body = { response };
  } 

  mount () {
    const {
      router,
      createBBA,
      updateBBA,
      deleteBBA,
      createGUA,
      updateGUA,
      deleteGUA,
      updateGBA,
      createGBA,
      deleteGBA,
      getGBAAnalysisResult,
      getGUAAnalysisResult,
      getBBAAnalysisResult,
    } = this;
    
    // router.post('/analyses/GBA' , Auth.isAuthenticated(), validate.createGBASchema, createGBA);
    // router.put('/analyses/GBA' , Auth.isAuthenticated(), validate.updateGBASchema, updateGBA);
    // router.delete('/analyses/GBA' , Auth.isAuthenticated(), validate.deleteGBASchema, deleteGBA);
    // router.post('/analyses/result/GBA' , Auth.isAuthenticated(), validate.resultGBASchema, getGBAAnalysisResult);

    // router.post('/analyses/GUA' , Auth.isAuthenticated(), validate.createGUASchema, createGUA);
    // router.put('/analyses/GUA' , Auth.isAuthenticated(), validate.createGUASchema, updateGUA);
    // router.delete('/analyses/GUA' , Auth.isAuthenticated(), validate.createGUASchema, deleteGUA);
    // router.post('/analyses/result/GUA' , Auth.isAuthenticated(), validate.resultGUASchema, getGUAAnalysisResult);

    // router.post('/analyses/BBA' , Auth.isAuthenticated(), validate.createBBASchema, createBBA);
    // router.put('/analyses/BBA' , Auth.isAuthenticated(), validate.createBBASchema, updateBBA);
    // router.delete('/analyses/BBA' , Auth.isAuthenticated(), validate.createBBASchema, deleteBBA);
    // router.post('/analyses/result/BBA' , Auth.isAuthenticated(), validate.resultBBASchema, getBBAAnalysisResult);
  }

}

module.exports = Analyses;
