async function getTokens() {
  try {
    const options = {
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${process.env.STRAPI_TALENT_FORM_API_KEY}`
      }
    }
    const { meta: { pagination: { total } } } = await
      fetch(`${process.env.STRAPI_BASE_URL}notification-tokens`,options)
        .then(response => response.json())
        .catch(error => console.log(error))
    
    const response = await
      fetch(`${process.env.STRAPI_BASE_URL}notification-tokens`, options)
        .then(response => response.json())
        .then(data => data.data.map((res) => res.attributes.tokenID))
        .catch(error => console.log(error));
    
    return response;
  } catch (error) {
    console.log('Error while fetching tokens,', error);
  }
}

module.exports = getTokens;