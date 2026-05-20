
import * as arctic from "arctic"
import { BadRequestError } from "./AppError.js"

class GoogleLogin {
    /**
     * initialize google Oauth api credentials
     * @param {CLIENT_ID} client_id 
     * @param {CLIENT_SECRET} client_secret 
     * @param {SCOPE} scope 
     * @param {REDIRECT_URI} redirect_uri 
     */
    constructor(client_id, client_secret, scope, redirect_uri) {
        this.CLIENT_ID = client_id
        this.CLIENT_SECRET = client_secret
        this.SCOPE = scope
        this.REDIRECT_URI = redirect_uri

        
        this.STATE_CODE = arctic.generateState()
        this.VERIFACTION_CODE = arctic.generateCodeVerifier()

    }
    /**
     * /// initialize instance of google api using client id, client secret and redirect url
     * @param void
     * @returns google /// return google cliend instance.
     */
    google() {
        const google = new arctic.Google(this.CLIENT_ID, this.CLIENT_SECRET, this.REDIRECT_URI)
        return google;
    }
    /**
     * @param {*} google /// google is instance of google-auth-library  
     * @returns url   /// generates a URL that is used to show the "Continue with Google" page
     */

    googleAuthURI(google) {
        const url = google.createAuthorizationURL(this.STATE_CODE, this.VERIFACTION_CODE, this.SCOPE);
        return url;
    }
    /**
     * 
     * @param {*} google // google takes google instance of google-auth-library
     * @param {*} code /// when successfully login by google server then google returns code that code is exchanged with tokens and other information according to scope
     * @returns {tokens} /// there includes access_token, id_token, expires_in, scope etc
     */

    async validate_authorization_code(google, code) {
        try {
            const tokens = await google.validateAuthorizationCode(
                code,
                this.VERIFACTION_CODE
            );

            // const accessToken = tokens.accessToken();
            // const accessTokenExpiresAt = tokens.accessTokenExpiresAt();

            // const accessToken = tokens.data.access_token;
            // const idToken = tokens.data.id_token;
            // console.log(accessToken);
            // console.log(idToken);

            return tokens;

        } catch (error) {
            console.log(error.message);
            throw new BadRequestError("error occer when exchange code.");
        }
    }

}
export default GoogleLogin;




