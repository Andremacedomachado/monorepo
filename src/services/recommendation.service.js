// getRecommendations.js

const getRecommendations = (
  formData = { selectedPreferences: [], selectedFeatures: [] },
  products
) => {
  
  const productsRankedFound = evalueateRankMachProductsByFilter(formData, products)
  var productsReuslt = []
  switch (formData.selectedRecommendationType) {
    case "SingleProduct":
      productsReuslt = filterByOne(productsRankedFound)
      break;
    case "MultipleProducts":
      productsReuslt = filterByMultiple(productsRankedFound)
      break;
    default:
      break;
  }
  return productsReuslt
};

const filterByOne = (
  productsRanked = []
) => {
  const productWithHighestMatch = getBestProductMatchByScoreAndId(productsRanked)
  return [productWithHighestMatch]
}

const filterByMultiple = (
  productsRanked = []
) => {
  const productsRankedOrdered = sortRankMacthByScoreAndId(productsRanked)
  return productsRankedOrdered
}

const evalueateRankMachProductsByFilter = (
  filtesParams = { selectedPreferences: [], selectedFeatures: [] },
  products = [],
  baseValuePreference = 1,
  baseValueFeature = 1
) => {

  const rankedProdutos = products.reduce((prev, current) => {
    const quantityMatchPreferences = (filtesParams.selectedPreferences !== undefined && filtesParams.selectedPreferences.length > 0) ? filtesParams.selectedPreferences.filter((pref) => current.preferences?.includes(pref)).length : 0;
    const quantityMatchFeatures = (filtesParams.selectedFeatures !== undefined && filtesParams.selectedFeatures.length > 0) ? filtesParams.selectedFeatures.filter((feat) => current.features?.includes(feat)).length : 0;
    const scoreMatch = (quantityMatchPreferences * baseValuePreference) + (quantityMatchFeatures * baseValueFeature);
    if (scoreMatch !== 0) {
      current.score = scoreMatch
      prev.push({ ...current, score: scoreMatch });
    }
    return prev
  }, [])
  return rankedProdutos
}

const getBestProductMatchByScoreAndId = (productsRanked = []) => {
  return productsRanked.reduce((prev, current, index) => {
    // logica de diferenciação de iguais baseda no id, supondo que seja incremental e seja o ultimo registro valido
    if (prev.score === current.score && prev.id < current.id) {
      prev = current
    }
    else if (prev.score < current.score) {
      prev = current;
    }
    // otimização de cast de um product ranked para product
    if (index === productsRanked.length - 1) {
      delete prev.score
    }
    return prev
  }, productsRanked[0])
};

const sortRankMacthByScoreAndId = (productsRanked = [], descendant = true) => {
  const placeLater = descendant ? 1 : -1;
  const placePreviously = descendant ? -1 : 1;

  return productsRanked.sort((current, next) => {
    if (current.score > next.score) {
      return placePreviously
    }
    else if (current.score < next.score) {
      return placeLater
    }
    else if (current.score === next.score && current.id > next.id) {
      return placePreviously
    }
    else {
      return placeLater
    }
  })
};
export default { getRecommendations };
