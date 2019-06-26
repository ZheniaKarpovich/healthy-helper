const Atc = require('../../models/medicine/atc');
const Product = require('../../models/medicine/product');
const Document = require('../../models/medicine/document');
const phThGroups = require('../../models/medicine/phThGroups');

const Module = require('../../core/module');
// const Auth = require('../auth');

const {
  validatePaginationSchema,
  validateGetProductListSchema,
  validateGetDocumentsListSchema,
} = require('./validation');


class Medicines extends Module {

  async getAtcList(ctx) {
    const { page, size } = ctx.query;

    const startWith = (page - 1) * size;

    const response = await Atc.query().limit(size).offset(startWith);

    ctx.status = 200;
    ctx.body = { response };
  }
  
  async getDocumentList(ctx) {
    const { page, size, productId } = ctx.query;
  
    const startWith = (page - 1) * size;
  
    const query = Document.query();

    if (productId) {
      query
        .join('product_document', 'product_document.DocumentID', 'document.DocumentID')
        .join('product', 'product.ProductID', 'product_document.ProductID')
        .where('product.ProductID', productId);
    }

    const response = await query.limit(size).offset(startWith);
  
    ctx.status = 200;
    ctx.body = { response };
  }
  
  async getGroupList(ctx) {
    const { page, size } = ctx.query;
  
    const startWith = (page - 1) * size;
  
    const response = await phThGroups.query().limit(size).offset(startWith);
  
    ctx.status = 200;
    ctx.body = { response };
  }
  
  async getProductList(ctx) {
    const { page, size, atcCode, groupId } = ctx.query;
    
    const startWith = (page - 1) * size;
    
    const query = Product.query();

    if (atcCode) {
      query
        .join('product_atc', 'product_atc.ProductID', 'product.ProductID')
        .join('atc', 'Atc.ATCCode', 'product_atc.ATCCode')
        .where('Atc.ATCCode', atcCode);
    }

    if (groupId) {
      query
        .join('product_phthgrp', 'product_phthgrp.ProductID', 'product.ProductID')
        .join('phthgroups', 'phthgroups.PhThGroupsID', 'product_phthgrp.PhThGroupsID')
        .where('phthgroups.PhThGroupsID', groupId);
    }

    const response = await query.limit(size).offset(startWith); 
  
    ctx.status = 200;
    ctx.body = { response };
  }

  mount () {
    const {
      router,
      getAtcList,
      getGroupList,
      getProductList,
      getDocumentList,
    } = this;
    
    router.get('/atc/list', /* Auth.isAuthenticated(),*/ validatePaginationSchema, getAtcList);

    router.get('/product/list', /* Auth.isAuthenticated(),*/ validateGetProductListSchema, getProductList);

    router.get('/document/list', /* Auth.isAuthenticated(),*/ validateGetDocumentsListSchema, getDocumentList);

    router.get('/group/list', /* Auth.isAuthenticated(),*/ validatePaginationSchema, getGroupList);
  }

}

module.exports = Medicines;
