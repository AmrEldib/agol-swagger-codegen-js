/*jshint -W069 */
/**
 *
 * @class agol
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var agol = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');

    function agol(options) {
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : 'http://www.arcgis.com';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
        this.token = (typeof options === 'object') ? (options.token ? options.token : {}) : {};
    }

    /**
     * Set Token
     * @method
     * @name agol#setToken
     * @param {string} value - token's value
     * @param {string} headerOrQueryName - the header or query name to send the token at
     * @param {boolean} isQuery - true if send the token as query param, otherwise, send as header param
     *
     */
    agol.prototype.setToken = function(value, headerOrQueryName, isQuery) {
        this.token.value = value;
        this.token.headerOrQueryName = headerOrQueryName;
        this.token.isQuery = isQuery;
    };

    /**
     * The Root resource only returns the version of the containing portal. It acts as a root to its child resources and operations. To obtain descriptive information about this portal including its name, logo, featured items, and supported protocols (HTTP vs HTTPS), access the Self resource under Portals.
     * @method
     * @name agol#getOrgRoot
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     *
     */
    agol.prototype.getOrgRoot = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Create Group operation (POST only) creates a new group in the Portal community. Only authenticated users can create groups. The user who creates the group automatically becomes the owner of the group. The owner of the group is automatically an administrator of the group. The calling user provides the title for the group, while the group ID is generated by the system.
     * @method
     * @name agol#createGroup
     * @param {} groupCommonParameters - Common parameters for creating and updating group information
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.createGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/createGroup';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['groupCommonParameters'] !== undefined) {
            body = parameters['groupCommonParameters'];
        }

        if (parameters['groupCommonParameters'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupCommonParameters'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Group Search operation searches for groups in the portal. The search index is updated whenever groups and organizations are created, updated, or deleted. There can be a lag between the time that a group is updated and the time when it's reflected in the search results. The results only contain groups that the user has permission to access. Care should be taken when using ArcGIS REST API search operations (search, user search, group search) to find items, groups, and users programmatically. The Portal uses a powerful search engine to index information and to allow full text searching on it. This search engine uses many different inputs to find the appropriate results and rank them. This often makes search 'fuzzy', making it ideal for human interaction, but not necessarily ideal for looking for specific records programmatically. Developers should avoid using search to find specific items (e.g. by title) as the results of these types of queries might change as the search engine evolves.
     * @method
     * @name agol#groupSearch
     * @param {string} q - The query string to search the groups against. See Search reference for advanced options. Example: q=arcgis+online. Search reference http://resources.arcgis.com/en/help/arcgis-rest-api/#/Search_reference/02r3000000mn000000/
     * @param {number} start - The number of the first entry in the result set response. The index number is 1-based. The default value of start is 1 (that is, the first search result). The start parameter, along with the num parameter, can be used to paginate the search results. Example: start=11 (return result #11 as the first entry in the response)
     * @param {number} num - The maximum number of results to be included in the result set response. The default value is 10, and the maximum allowed value is 100. The start parameter, along with the num parameter, can be used to paginate the search results.
     * @param {string} sortField - Field to sort by. The allowed field names are title, owner, and created.
     * @param {string} sortOrder - Describes whether order returns in ascending or descending order. Default is ascending.
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.groupSearch = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['q'] !== undefined) {
            queryParameters['q'] = parameters['q'];
        }

        if (parameters['start'] !== undefined) {
            queryParameters['start'] = parameters['start'];
        }

        if (parameters['num'] !== undefined) {
            queryParameters['num'] = parameters['num'];
        }

        if (parameters['sortField'] !== undefined) {
            queryParameters['sortField'] = parameters['sortField'];
        }

        if (parameters['sortOrder'] !== undefined) {
            queryParameters['sortOrder'] = parameters['sortOrder'];
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     *  The Group resource represents a group (for example, San Bernardino Fires) within the portal. The owner is automatically an administrator and is returned in the list of admins. Administrators can invite, add to, or remove members from a group as well as update or delete the group. The administrator for an organization can also reassign the group to another member of the organization. Group members can leave the group. Authenticated users can apply to join a group unless the group is by invitation only. The visibility of the group by other users is determined by the access property. If the group is private, no one other than the administrators and members of the group will be able to see it. If the group is shared with an organization, all members of the organization will be able to find it
     * @method
     * @name agol#getGroup
     * @param {string} groupId - Id of the group
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * A group administrator can invite users to join their group using the Invite to Group operation. This creates a new user invitation, which the users accept or decline. The role of the user and the invitation expiration date can be set in the invitation. A notification is created for the user indicating that they were invited to join the group. Available only to authenticated users.
     * @method
     * @name agol#inviteToGroup
     * @param {string} groupId - Id of the group
     * @param {} inviteDetails - Details for inviting users to a group
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.inviteToGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/invite';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['inviteDetails'] !== undefined) {
            body = parameters['inviteDetails'];
        }

        if (parameters['inviteDetails'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: inviteDetails'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The operation to Add Users to Group (POST only) is available only to the group administrators, including the owner, and to the administrator of the organization if the user is a member. Both users and admins can be added using this operation. This is useful if you wish to add users directly within an organization without requiring them to accept an invitation. For example, a member of an organization can add only other organization members but not public users
     * @method
     * @name agol#addUsersToGroup
     * @param {string} groupId - Id of the group
     * @param {} users - A comma-separated list of usernames (both admins and regular users) to be added to the group. Example: users=regularusername1,adminusername1,adminusername2,regularusername2
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.addUsersToGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/addUsers';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['users'] !== undefined) {
            body = parameters['users'];
        }

        if (parameters['users'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: users'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Lists the group applications for the given group. Available to administrators of the group or administrators of an organization if the group is part of one
     * @method
     * @name agol#getGroupApplications
     * @param {string} groupId - Id of the group
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getGroupApplications = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/applications';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * When an individual user applies to join a group, a group application is created. The group administrators can accept or decline the application. Available only to the group administrators and the administrator of the organization if the group belongs to an organization
     * @method
     * @name agol#getGroupApplication
     * @param {string} groupId - Id of the group
     * @param {string} applicationUsername - Name of the user applying to join the group
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getGroupApplication = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/applications/{applicationUsername}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        path = path.replace('{applicationUsername}', parameters['applicationUsername']);

        if (parameters['applicationUsername'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: applicationUsername'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * When a user applies to join a group, a group application is created. Group administrators choose to accept this application using the Accept Group Application operation (POST only). This operation adds the applying user to the group then deletes the application. This operation also creates a notification for the user indicating that the user's group application was accepted. Available only to group owners and admins
     * @method
     * @name agol#acceptGroupApplication
     * @param {string} groupId - Id of the group
     * @param {string} applicationUsername - Name of the user applying to join the group
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.acceptGroupApplication = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/applications/{applicationUsername}/accept';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        path = path.replace('{applicationUsername}', parameters['applicationUsername']);

        if (parameters['applicationUsername'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: applicationUsername'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * When a user applies to join a group, a group application is created. Group administrators can decline this application using the Decline Group Application operation (POST only). This operation deletes the application and creates a notification for the user indicating that the user's group application was declined. The applying user will not be added to the group. Available only to group owners and admins
     * @method
     * @name agol#declineGroupApplication
     * @param {string} groupId - Id of the group
     * @param {string} applicationUsername - Name of the user applying to join the group
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.declineGroupApplication = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/applications/{applicationUsername}/decline';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        path = path.replace('{applicationUsername}', parameters['applicationUsername']);

        if (parameters['applicationUsername'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: applicationUsername'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Delete Group operation (POST only) is available only to the group administrators or to the administrator of the organization to which the owner belongs
     * @method
     * @name agol#deleteGroup
     * @param {string} groupId - Id of the group
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.deleteGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/delete';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Users apply to join a group using the Join Group operation (POST only). This creates a new group application, which the group administrators accept or decline. This operation also creates a notification for the user indicating that they have applied to join this group. Available only to authenticated users. Users can only apply to join groups to which they have access. If the group is private, users will not be able to find it to ask to join it. Information pertaining to the applying user, such as their full name and username, can be sent as part of the group application.
     * @method
     * @name agol#joinGroup
     * @param {string} groupId - Id of the group
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.joinGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/join';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Leave Group operation (POST only) is available to all group members other than the group owner. Leaving a group automatically results in the unsharing of all items the user has shared with the group.
     * @method
     * @name agol#leaveGroup
     * @param {string} groupId - Id of the group
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.leaveGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/leave';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Reassign Group operation (POST only) allows the administrator of an organization to reassign a group to another member of the organization.
     * @method
     * @name agol#reassignGroup
     * @param {string} groupId - Id of the group
     * @param {} targetUsername - The target username of the new owner of the group. Example: organization_username1
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.reassignGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/reassign';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['targetUsername'] !== undefined) {
            body = parameters['targetUsername'];
        }

        if (parameters['targetUsername'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: targetUsername'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The operation to Remove Users From Group (POST only) is available only to the group administrators, including the owner, and to the administrator of the organization if the user is a member. Both users and admins can be removed using this operation. Group owners cannot be removed from the group.
     * @method
     * @name agol#removeUsersFromGroup
     * @param {string} groupId - Id of the group
     * @param {} users - A comma-separated list of usernames (both admins and regular users) to be removed from the group. Example: users=regularusername1,adminusername1,adminusername2,            regularusername2
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.removeUsersFromGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/removeUsers';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['users'] !== undefined) {
            body = parameters['users'];
        }

        if (parameters['users'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: users'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Update Group operation (POST only) modifies properties such as the group title, tags, description, sort field and order, and member sharing capabilities. Available only to the group administrators or to the administrator of the organization if the user is a member. Only the properties that are to be updated need to be specified in the request. Properties not specified will not be affected. The group ID cannot be modified.
     * @method
     * @name agol#updateGroup
     * @param {string} groupId - Id of the group
     * @param {} groupCommonParameters - Common parameters for creating and updating group information
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.updateGroup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/update';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['groupCommonParameters'] !== undefined) {
            body = parameters['groupCommonParameters'];
        }

        if (parameters['groupCommonParameters'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupCommonParameters'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Lists the users, owner, and administrators of a given group. Only available to members or administrators of the group
     * @method
     * @name agol#getGroupUsers
     * @param {string} groupId - Id of the group
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getGroupUsers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/groups/{groupId}/users';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * This resource allows discovery of the current authenticated user identified by the token
     * @method
     * @name agol#getUserSelf
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getUserSelf = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/self';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The User Search operation searches for users in the portal. The search index is updated whenever users are created, updated, or deleted. There can be a lag between the time that the user is updated and the time when it's reflected in the search results. The results only contain users that the calling user has permissions to see. Users can control this visibility by changing the access property of their user. Care should be taken when using ArcGIS REST API search operations (search, user search, group search) to find items, groups, and users programmatically. The Portal uses a powerful search engine to index information and to allow full text searching on it. This search engine uses many different inputs to find the appropriate results and rank them. This often makes search 'fuzzy', making it ideal for human interaction, but not necessarily ideal for looking for specific records programmatically. Developers should avoid using search to find specific items (e.g. by title) as the results of these types of queries might change as the search engine evolves.
     * @method
     * @name agol#searchUsers
     * @param {string} q - The query string to search the groups against. See Search reference for advanced options. Example: q=arcgis+online. Search reference http://resources.arcgis.com/en/help/arcgis-rest-api/#/Search_reference/02r3000000mn000000/
     * @param {number} start - The number of the first entry in the result set response. The index number is 1-based. The default value of start is 1 (that is, the first search result). The start parameter, along with the num parameter, can be used to paginate the search results. Example: start=11 (return result #11 as the first entry in the response)
     * @param {number} num - The maximum number of results to be included in the result set response. The default value is 10, and the maximum allowed value is 100. The start parameter, along with the num parameter, can be used to paginate the search results.
     * @param {string} sortField - Field to sort by. The allowed field names are title, owner, and created.
     * @param {string} sortOrder - Describes whether order returns in ascending or descending order. Default is ascending.
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.searchUsers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['q'] !== undefined) {
            queryParameters['q'] = parameters['q'];
        }

        if (parameters['start'] !== undefined) {
            queryParameters['start'] = parameters['start'];
        }

        if (parameters['num'] !== undefined) {
            queryParameters['num'] = parameters['num'];
        }

        if (parameters['sortField'] !== undefined) {
            queryParameters['sortField'] = parameters['sortField'];
        }

        if (parameters['sortOrder'] !== undefined) {
            queryParameters['sortOrder'] = parameters['sortOrder'];
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * A user resource representing a registered user of the portal. Personal details of the user, such as e-mail and groups, are returned only to the user or the administrator of the user's organization (the properties in the Response Properties table below). A user is not visible to any other user (except the organization's administrator) if their access setting is set to 'private.
     * @method
     * @name agol#getUser
     * @param {string} userName - Name of the user
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getUser = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Delete User operation (POST only) is available only to the user in question or to the administrator of the user's organization. If deleting a user who is part of an organization, their content and groups must be transferred to another member or deleted prior to deleting the user. If the user is not part of an organization, all content and groups of the user must first be deleted. Deleting a user whose identity provider is the Esri Global Account will not delete the user from the Esri Global Account system.
     * @method
     * @name agol#deleteUser
     * @param {string} userName - Name of the user
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.deleteUser = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}/delete';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Disable operation (POST only) disables login access for the user. It is only available to the administrator of the organization.
     * @method
     * @name agol#disableUser
     * @param {string} userName - Name of the user
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.disableUser = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}/disable';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Enable operation (POST only) enables login access for the user. It is only available to the administrator of the organization.
     * @method
     * @name agol#enableUser
     * @param {string} userName - Name of the user
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.enableUser = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}/enable';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Shows the invitations sent to the authenticated user
     * @method
     * @name agol#getUserInvitations
     * @param {string} userName - Name of the user
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getUserInvitations = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}/invitations';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * An individual invitation to join a given group. The user can accept the invitation or decline the invitation. Invitations are currently only to join groups but may be extended in the future to allow for other targetTypes. Developers should design their applications so that targetTypes is checked and unknown targetTypes are ignored. Invitations are also currently only sent to usernames. This is determined by the type property of the invitation. In the future, other types of invitations may be introduced. Developers should design their applications to make sure they check type and ignore unknown types
     * @method
     * @name agol#getUserInvitation
     * @param {string} userName - Name of the user
     * @param {string} invitationId - The ID of the invitation
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getUserInvitation = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}/invitations/{invitationId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        path = path.replace('{invitationId}', parameters['invitationId']);

        if (parameters['invitationId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: invitationId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * When a group owner or an administrator invites a user to their group, it results in a user invitation. The invited user accepts the invitation using the Accept Invitation operation (POST only). This operation adds the invited user to the group, and the invitation is deleted. This operation also creates a notification for the user indicating that the user's invitation was accepted. Available only to authenticated users
     * @method
     * @name agol#acceptInvitation
     * @param {string} userName - Name of the user
     * @param {string} invitationId - The ID of the invitation
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.acceptInvitation = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}/invitations/{invitationId}/accept';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        path = path.replace('{invitationId}', parameters['invitationId']);

        if (parameters['invitationId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: invitationId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * When a group administrator invites a user to their group, it results in a group invitation. The invited user can decline the invitation using the Decline Invitation operation (POST only). The operation deletes the invitation and creates a notification for the user indicating that they declined the invitation. The invited user is not added to the group. Available only to authenticated users
     * @method
     * @name agol#declineInvitation
     * @param {string} userName - Name of the user
     * @param {string} invitationId - The ID of the invitation
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.declineInvitation = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}/invitations/{invitationId}/decline';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        path = path.replace('{invitationId}', parameters['invitationId']);

        if (parameters['invitationId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: invitationId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * An individual notification for the given user that can be of different types as described in the Notification types section below. Available only to the user recipient of the notification. In the JSON response for a notification, the data property will vary based on the notification type
     * @method
     * @name agol#getNotification
     * @param {string} userName - Name of the user
     * @param {string} notificationId - Id of the notification
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getNotification = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}/notifications/{notificationId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        path = path.replace('{notificationId}', parameters['notificationId']);

        if (parameters['notificationId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: notificationId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The list of notifications available for the given user. These can have different types as described in the documentation for the Notification resource
     * @method
     * @name agol#getNotifications
     * @param {string} userName - Name of the user
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getNotifications = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}/notifications';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Delete Notification operation (POST only) is available only to the user who receives the notification
     * @method
     * @name agol#deleteNotification
     * @param {string} userName - Name of the user
     * @param {string} notificationId - Id of the notification
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.deleteNotification = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}/notifications/{notificationId}/delete';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        path = path.replace('{notificationId}', parameters['notificationId']);

        if (parameters['notificationId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: notificationId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Update User operation (POST only) modifies properties such as description, preferred view, tags, access, and thumbnail. The user name cannot be modified. For the 'ecas' identity provider, password, e-mail, and full name must be modified by editing your Esri Global Account. For the 'arcgis' identity provider, password, full name, security question, and security answer can be updated with Update User. Update User is available only to the user or to the administrator of the user's organization. Only the properties that are to be updated need to be specified in the request. Properties not specified will not be affected.
     * @method
     * @name agol#updateUser
     * @param {string} userName - Name of the user
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.updateUser = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}/update';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Users tag the content they publish in their portal via the add and update item calls. This resource lists all the tags used by the user along with the number of times the tags have been used
     * @method
     * @name agol#getUserTags
     * @param {string} userName - Name of the user
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getUserTags = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/community/users/{userName}/tags';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The group's content provides access to the items that are shared with the group. Group items are stored by reference and are not physically stored in a group. Rather, they are stored as links to the original item in the item resource (/content/items/<itemId>). Available only to the users of the group and the administrator of the organization to which the group belongs, if any
     * @method
     * @name agol#getGroupContent
     * @param {string} groupId - Id of the group
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getGroupContent = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/groups/{groupId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{groupId}', parameters['groupId']);

        if (parameters['groupId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: groupId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * An item (a unit of content) in the portal. Each item has a unique identifier and a well known URL that is independent of the user owning the item. An item can have associated binary or textual data that's available via the item data resource. For example, an item of type Map Package returns the actual bits corresponding to the map package via the item data resource. The numViews is incremented when an item is opened
     * @method
     * @name agol#getItem
     * @param {string} itemId - Id of the item
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getItem = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/items/{itemId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{itemId}', parameters['itemId']);

        if (parameters['itemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: itemId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Adds a comment to an item (POST only). Available only to authenticated users who have access to the item
     * @method
     * @name agol#addComment
     * @param {string} itemId - Id of the item
     * @param {} comment - Text of the comment to be added
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.addComment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/items/{itemId}/addComment';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{itemId}', parameters['itemId']);

        if (parameters['itemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: itemId'));
            return deferred.promise;
        }

        if (parameters['comment'] !== undefined) {
            body = parameters['comment'];
        }

        if (parameters['comment'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: comment'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Lists all comments for an item
     * @method
     * @name agol#getItemComments
     * @param {string} itemId - Id of the item
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getItemComments = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/items/{itemId}/comments';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{itemId}', parameters['itemId']);

        if (parameters['itemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: itemId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Gets details for a particular comment
     * @method
     * @name agol#getItemComment
     * @param {string} itemId - Id of the item
     * @param {string} commentId - Id of the comment
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getItemComment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/items/{itemId}/comments/{commentId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{itemId}', parameters['itemId']);

        if (parameters['itemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: itemId'));
            return deferred.promise;
        }

        path = path.replace('{commentId}', parameters['commentId']);

        if (parameters['commentId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: commentId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Lists the groups of which the item is a part. Only shows the groups that the calling user can access
     * @method
     * @name agol#getItemGroups
     * @param {string} itemId - Id of the item
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getItemGroups = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/items/{itemId}/groups';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{itemId}', parameters['itemId']);

        if (parameters['itemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: itemId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Lists all comments for an item
     * @method
     * @name agol#getItemRating
     * @param {string} itemId - Id of the item
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getItemRating = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/items/{itemId}/rating';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{itemId}', parameters['itemId']);

        if (parameters['itemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: itemId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Gets all the related items of a certain relationship type for that item. An optional direction can be specified if the direction of the relationship is ambiguous. Otherwise, the service will try to infer it
     * @method
     * @name agol#getRelatedItems
     * @param {string} itemId - Id of the item
     * @param {string} relationshipType - The type of relationship between the two items. See Relationship types for a complete listing of types
     * @param {string} direction - The direction of the relationship. Either forward (from origin -> destination) or reverse (from destination -> origin)
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getRelatedItems = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/items/{itemId}/relatedItems';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{itemId}', parameters['itemId']);

        if (parameters['itemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: itemId'));
            return deferred.promise;
        }

        if (parameters['relationshipType'] !== undefined) {
            queryParameters['relationshipType'] = parameters['relationshipType'];
        }

        if (parameters['relationshipType'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: relationshipType'));
            return deferred.promise;
        }

        if (parameters['direction'] !== undefined) {
            queryParameters['direction'] = parameters['direction'];
        }

        if (parameters['direction'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: direction'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Add Item Part allows the caller to upload a file part when doing an add or update item operation in multipart mode. Each upload takes an integer part number that indicates the order of this part compared to others. Each part can be uploaded at any time, in any order, even simultaneously. Each file part must be uploaded in an HTTP multipart request pursuant to IETF RFC1867.
     * @method
     * @name agol#addItemPart
     * @param {string} itemId - Id of the item
     * @param {} partDetails - Details for adding an item part
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.addItemPart = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/items/{itemId}/addPart';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{itemId}', parameters['itemId']);

        if (parameters['itemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: itemId'));
            return deferred.promise;
        }

        if (parameters['partDetails'] !== undefined) {
            body = parameters['partDetails'];
        }

        if (parameters['partDetails'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: partDetails'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Adds a rating to an item to which you have access (POST only). Only one rating can be given to an item per user. If this call is made on a currently rated item, the new rating will overwrite the existing rating. A user cannot rate their own item. Available only to authenticated users
     * @method
     * @name agol#addRating
     * @param {string} itemId - Id of the item
     * @param {} rating - Rating to set for the item. Rating must be a floating point number between 1.0 and 5.0.
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.addRating = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/items/{itemId}/addRating';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{itemId}', parameters['itemId']);

        if (parameters['itemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: itemId'));
            return deferred.promise;
        }

        if (parameters['rating'] !== undefined) {
            body = parameters['rating'];
        }

        if (parameters['rating'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: rating'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Deletes the particular comment (POST only). This functionality is available to authenticated users who originally created the comment and item owners on items that they own
     * @method
     * @name agol#deleteComment
     * @param {string} itemId - Id of the item
     * @param {string} commentId - Id of the comment
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.deleteComment = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/items/{itemId}/comments/{commentId}/delete';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{itemId}', parameters['itemId']);

        if (parameters['itemId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: itemId'));
            return deferred.promise;
        }

        path = path.replace('{commentId}', parameters['commentId']);

        if (parameters['commentId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: commentId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Add Item operation (POST only) is used to upload an item file, submit text content, or submit the item URL to the specified user folder depending on documented items and item types. This operation is available only to the specified user. The request to upload an item file must be a multipart request pursuant to IETF RFC1867. The request to submit text content or a URL can be a standard HTTP POST request. The user owning the folder automatically becomes the owner of the item. The item is flagged as private (that is, not shared with any group) by default. This can be changed using the Share Item operation. The added item is available to everyone it's shared with at the item resource. The item is also available to the owner at the user item resource, which supports operations to update, delete, move, share, and unshare items. The addItem operation allows users to optionally create a relationship and share an item in one call. See Add Relationship for parameter information. The same rules apply, with the following exceptions:
    If you specify an originItemId, the new item is added as the destination item.
    If you specify a destinationitemId, the new item is added as the origin item.
    If you specify both, an error is thrown.
    The relationship creation is done after the item is created.
    If the item doesn’t add correctly, no relationship is created.
    If the item adds correctly, but the relationship fails (that is, bad relationship type, invalid origin or destination item, and so on), the item is deleted.
    The destination item will inherit all the sharing permissions of the origin item.
    The filename or URL used for an item must be unique within the particular user's folder.
     * @method
     * @name agol#addItem
     * @param {string} userName - Name of the user
     * @param {} itemDetails - Details for adding an item
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.addItem = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/items/{userName}/addItem';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        if (parameters['itemDetails'] !== undefined) {
            body = parameters['itemDetails'];
        }

        if (parameters['itemDetails'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: itemDetails'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The user's content are items either in the home folder for the user, e.g. /content/users/<username>, or in a subfolder of the home folder with the given folder ID. Multilevel folders are not supported. You can also see the Quick reference topic for additional information on this. Items in a folder are stored by reference and are not physically in a folder. Rather, they're stored as links to the original item, e.g. /content/items/<itemId>
     * @method
     * @name agol#getUserContent
     * @param {string} userName - Name of the user
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getUserContent = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/users/{userName}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Creates a folder in which items can be placed. Folders are only visible to a user and solely used for organizing content within that user's content space. The create user folder operation (POST only) is available only on the user's root folder. Multilevel folders are not supported. The user provides the title for the folder, which must be unique to that user. The folder ID is generated by the system.
     * @method
     * @name agol#createFolder
     * @param {string} userName - Name of the user
     * @param {} title - The folder title. Two folders that belong to the same user cannot have the same title.
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.createFolder = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/users/{userName}/createFolder';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        if (parameters['title'] !== undefined) {
            body = parameters['title'];
        }

        if (parameters['title'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: title'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Create Service operation (POST only) allows users to create a hosted feature service. You can use the API to create an empty hosted feaure service from feature service metadata JSON
     * @method
     * @name agol#createService
     * @param {string} userName - Name of the user
     * @param {} serviceDetails - Details for creating a service
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.createService = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/users/{userName}/createService';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        if (parameters['serviceDetails'] !== undefined) {
            body = parameters['serviceDetails'];
        }

        if (parameters['serviceDetails'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: serviceDetails'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The delete user folder operation (POST only) is available only on the user's non-root folders. The user's root folder cannot be deleted. Deleting a folder also deletes all items that it contains (both the items and the links are removed)
     * @method
     * @name agol#deleteFolder
     * @param {string} userName - Name of the user
     * @param {string} folderId - Id of the folder
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.deleteFolder = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/content/users/{userName}/{folderId}/delete';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{userName}', parameters['userName']);

        if (parameters['userName'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: userName'));
            return deferred.promise;
        }

        path = path.replace('{folderId}', parameters['folderId']);

        if (parameters['folderId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: folderId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * This operation generates an access token in exchange for user credentials that can be used by clients when working with the ArcGIS Portal API. The call is only allowed over HTTPS and must be a POST. The access token represents the authenticated user for a certain amount of time to all other API functionality. Developers using the API must take care to protect the token against malicious use just as they would the original credentials, and they must be prepared to renew the token. Expired tokens will be rejected by the server. From version 2.1, the generateToken operation also supports generation of a server-token in exchange for a portal token. This server-token is required for clients to access resources from a federated server. The parameters token and serverUrl are required to generate a server-token. See the descriptions of these parameters below for additional information. Organizations that choose to implement higher levels of security for their organizations can set the allSSL setting to true for their organization or portal. The effect of setting allSSL to true is that all non-HTTPS requests for resources belonging to the organization will be rejected. Setting allSSL to true guarantees that all transmissions of access tokens as well as data between clients and servers is over a secure encrypted channel and provides protection to tokens and data in transit. When generateToken is called for a user in such an organization, it returns a response property of ssl=true, and the token must always be passed back via HTTPS to the portal.
     * @method
     * @name agol#generateToken
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {} tokenDetails - Details for generating a token
     *
     */
    agol.prototype.generateToken = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/generateToken';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['tokenDetails'] !== undefined) {
            body = parameters['tokenDetails'];
        }

        if (parameters['tokenDetails'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: tokenDetails'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Lists the available languages
     * @method
     * @name agol#getPortalLanguages
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     *
     */
    agol.prototype.getPortalLanguages = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/portals/languages';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * This resource represents an ArcGIS Server site that has been federated with the portal. This resource is not applicable to ArcGIS Online; it is only applicable to Portal for ArcGIS
     * @method
     * @name agol#getPortalServer
     * @param {string} portalId - Id of the portal
     * @param {string} serverId - Id of the server
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getPortalServer = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/portals/{portalId}/servers/{serverId}';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        path = path.replace('{portalId}', parameters['portalId']);

        if (parameters['portalId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: portalId'));
            return deferred.promise;
        }

        path = path.replace('{serverId}', parameters['serverId']);

        if (parameters['serverId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: serverId'));
            return deferred.promise;
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Lists the available regions
     * @method
     * @name agol#getPortalRegions
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     *
     */
    agol.prototype.getPortalRegions = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/portals/regions';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Resources lists all file resources for the organization. The start and num paging parameters are supported.
     * @method
     * @name agol#getPortalResources
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     * @param {number} start - The number of the first entry in the result set response. The index number is 1-based. The default value of start is 1 (that is, the first search result). The start parameter, along with the num parameter, can be used to paginate the search results. Example: start=11 (return result #11 as the first entry in the response)
     * @param {number} num - The maximum number of results to be included in the result set response. The default value is 10, and the maximum allowed value is 100. The start parameter, along with the num parameter, can be used to paginate the search results.
     *
     */
    agol.prototype.getPortalResources = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/portals/resources';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters['start'] !== undefined) {
            queryParameters['start'] = parameters['start'];
        }

        if (parameters['num'] !== undefined) {
            queryParameters['num'] = parameters['num'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Portal Self resource is used to return the view of the portal as seen by the current user, anonymous or logged in. It includes information such as the name, logo, featured items, and supported protocols (HTTP vs. HTTPS) for this portal. If the user is not logged in, this call will return the default view of the portal. If the user is logged in, the view of the returned portal will be specific to the organization to which the user belongs. The default view of the portal is dependent on the culture of the user, which is obtained from the user's profile. A parameter to pass in the locale/culture is available for anonymous users.
     * @method
     * @name agol#getPortalSelf
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getPortalSelf = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/portals/self';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * This resource lists the ArcGIS Server sites that have been federated with the portal. This resource is not applicable to ArcGIS Online; it is only applicable to Portal for ArcGIS
     * @method
     * @name agol#getPortalServers
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.getPortalServers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/portals/servers';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Lists all the members of the organization. The start and num paging parameters are supported
     * @method
     * @name agol#getPortalUsers
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     * @param {number} start - The number of the first entry in the result set response. The index number is 1-based. The default value of start is 1 (that is, the first search result). The start parameter, along with the num parameter, can be used to paginate the search results. Example: start=11 (return result #11 as the first entry in the response)
     * @param {number} num - The maximum number of results to be included in the result set response. The default value is 10, and the maximum allowed value is 100. The start parameter, along with the num parameter, can be used to paginate the search results.
     *
     */
    agol.prototype.getPortalUsers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/portals/users';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters['start'] !== undefined) {
            queryParameters['start'] = parameters['start'];
        }

        if (parameters['num'] !== undefined) {
            queryParameters['num'] = parameters['num'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * The Root resource only returns the version of the containing portal. It acts as a root to its child resources and operations. To obtain descriptive information about this portal including its name, logo, featured items, and supported protocols (HTTP vs HTTPS), access the Self resource under Portals.
     * @method
     * @name agol#search
     * @param {string} q - The query string to search the groups against. See Search reference for advanced options. Example: q=arcgis+online. Search reference http://resources.arcgis.com/en/help/arcgis-rest-api/#/Search_reference/02r3000000mn000000/
     * @param {string} bbox - The bounding box for a spatial search defined as minx, miny, maxx, or maxy. Search requires q, bbox, or both. Spatial search is an overlaps/intersects function of the query bbox and the extent of the document. Documents that have no extent (e.g., mxds, 3dds, lyr) will not be found when doing a bbox search. Document extent is assumed to be in the WGS84 geographic coordinate system. Example: bbox=-118,32,-116,34
     * @param {number} start - The number of the first entry in the result set response. The index number is 1-based. The default value of start is 1 (that is, the first search result). The start parameter, along with the num parameter, can be used to paginate the search results. Example: start=11 (return result #11 as the first entry in the response)
     * @param {number} num - The maximum number of results to be included in the result set response. The default value is 10, and the maximum allowed value is 100. The start parameter, along with the num parameter, can be used to paginate the search results.
     * @param {string} sortField - Field to sort by. The allowed field names are title, owner, and created.
     * @param {string} sortOrder - Describes whether order returns in ascending or descending order. Default is ascending.
     * @param {string} f - The output format can be HTML, JSON, or PJSON. The default is HTML. Search and item comments support RSS as an output format. Values: html, json, pjson
     * @param {string} token - Generated by the generateToken call, an access token that identifies the authenticated user and controls access to restricted resources and operations.
     *
     */
    agol.prototype.search = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/sharing/rest/search';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        headers['Content-Type'] = ['application/json'];

        if (parameters['q'] !== undefined) {
            queryParameters['q'] = parameters['q'];
        }

        if (parameters['bbox'] !== undefined) {
            queryParameters['bbox'] = parameters['bbox'];
        }

        if (parameters['start'] !== undefined) {
            queryParameters['start'] = parameters['start'];
        }

        if (parameters['num'] !== undefined) {
            queryParameters['num'] = parameters['num'];
        }

        if (parameters['sortField'] !== undefined) {
            queryParameters['sortField'] = parameters['sortField'];
        }

        if (parameters['sortOrder'] !== undefined) {
            queryParameters['sortOrder'] = parameters['sortOrder'];
        }

        if (parameters['f'] !== undefined) {
            queryParameters['f'] = parameters['f'];
        }

        if (parameters['f'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: f'));
            return deferred.promise;
        }

        if (parameters['token'] !== undefined) {
            queryParameters['token'] = parameters['token'];
        }

        if (parameters['token'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: token'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body
        };
        if (Object.keys(form).length > 0) {
            req.form = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };

    return agol;
})();

exports.agol = agol;
