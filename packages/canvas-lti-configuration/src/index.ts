import z from 'zod';

/** @see https://developerdocs.instructure.com/services/canvas/external-tools/lti/file.lti_dev_key_config */
export const schema = z.object({
  $schema: z
    .union([z.url(), z.string().startsWith('./'), z.string().startsWith('../')])
    .optional(),

  /**
   * The default name of the tool in the app index. This value is also
   * displayed if no "text" field is provided within extension settings or
   * placements.
   */
  title: z.string(),

  /** A description of the tool. */
  description: z.string(),

  /** The login initiation url that Canvas should redirect the User Agent to. */
  oidc_initiation_url: z.url(),

  /**
   * Optional region-specific login initiation urls that Canvas should
   * redirect the User Agent to. Each institution's Canvas install lives in a
   * particular AWS region, typically one close to the institution's physical
   * region. If this AWS region is listed as a key in this object, the URL in
   * the value will override the default `oidc_initiation_url`. As of 2023,
   * the regions used by Canvas are: us-east-1, us-west-2, ca-central-1,
   * eu-west-1, eu-central-1, ap-southeast-1, ap-southeast-2.
   */
  oidc_initiation_urls: z
    .record(
      z.enum([
        'us-east-1',
        'us-west-2',
        'ca-central-1',
        'eu-west-1',
        'eu-central-1',
        'ap-southeast-1',
        'ap-southeast-2'
      ]),
      z.url()
    )
    .optional(),

  /**
   * The target_link_uri that Canvas should pass in the to the login
   * initiation endpoint. This allows tools to determine which redirect_uri to
   * pass Canvas in the authorization redirect request and should be verified
   * during the final launch. This can be set at the tool-level, or within the
   * "placements" JSON object for placement-specific target_link_uri's.
   */
  target_link_uri: z.url(),

  /**
   * The comma separated list of scopes to be allowed when using the
   * client_credentials grant to access LTI services.
   */
  scopes: z
    .array(
      z.enum([
        'https://purl.imsglobal.org/spec/lti-ags/scope/lineitem',
        'https://purl.imsglobal.org/spec/lti-ags/scope/result.readonly',
        'https://purl.imsglobal.org/spec/lti-ags/scope/score',
        'https://purl.imsglobal.org/spec/lti-nrps/scope/contextmembership.readonly',
        'https://purl.imsglobal.org/spec/lti-ags/scope/lineitem.readonly',
        'https://purl.imsglobal.org/spec/lti/scope/noticehandlers',
        'https://canvas.instructure.com/lti/public_jwk/scope/update'
      ])
    )
    .optional(),

  extensions: z
    .object({
      /**
       * The domain Canvas should use to match clicked LTI links against.
       * This is recommended if deep linking is used.
       */
      domain: z.string().optional(),

      /** Allows tools to set a unique identifier for the tool. */
      tool_id: z.string().optional(),

      /**
       * The LMS platform that the extensions belong to. This should always be
       * set to "canvas.instructure.com" for cloud-hosted Canvas.
       */
      platform: z.string().optional(),

      /**
       * What level of user information to send to the external tool. Setting
       * this to "name_only" will include fields that contain the user's name
       * and sourcedid in the launch claims. "email_only" will include only
       * the user's email. "public" includes all fields from "name_only",
       * "email_only", and fields like the user's picture. "anonymous" will
       * not include any of these fields. Note that the "sub" claim containing
       * the user's ID is always included.
       */
      privacy_level: z
        .enum(['anonymous', 'public', 'name_only', 'email_only'])
        .optional(),

      /**
       * The set of platform-specific settings to be used. See settings
       * parameters below.
       */
      settings: z
        .object({
          /**
           * Custom fields that will be sent to the tool consumer; can be set
           * at the tool-level or within the "placement" JSON object for
           * placement-specific custom fields. When the tool is launched, all
           * custom fields will be sent to the tool as strings. Read more
           * about variable substitutions in custom fields.
           */
          custom_fields: z.object().optional(),

          /**
           * The url of the icon to show for this tool. Can be set within the
           * "settings" object for tool-level icons, or in the "placement"
           * object for placement-specific icons. NOTE: Not all placements
           * display an icon.
           */
          icon_url: z.url().optional(),

          /**
           * An object for translations of the "text", used to support
           * internationalization (i18n) / localization (l10n). If the user's
           * Canvas interface is set to one of the languages listed, the tool
           * will display the translated text in place of the value in the
           * "text" field. This JSON object is in the format {"en": "Name",
           * "es": "Nombre"}, where "en" and "es" are IETF language tags. More
           * specific locales ("en-AU") are preferred over less specific ones
           * ("en"). A partial list of language tags can be found here. Can be
           * set within "settings" or individual placements.
           */
          labels: z.object().optional(),

          /** Settings to be used for specific tool placements. Values given in this settings.placements array will override the value given in the `settings` object for that particular placement. See placements parameters below. */
          placements: z
            .array(
              z.union([
                z.object({
                  /** Name of the placement that this settings object should apply to. See full list of placements here. */
                  placement: z.enum([
                    'account_navigation',
                    'ActivityAssetProcessor',
                    'assignment_edit',
                    'assignment_group_menu',
                    'assignment_index_menu',
                    'assignment_menu',
                    'assignment_selection',
                    'assignment_view',
                    'collaboration',
                    'course_assignments_menu',
                    'course_home_sub_navigation',
                    'course_navigation',
                    'course_settings_sub_navigation',
                    'discussion_topic_index_menu',
                    'discussion_topic_menu',
                    'editor_button',
                    'file_index_menu',
                    'file_menu',
                    'global_navigation',
                    'homework_submission',
                    'link_selection',
                    'migration_selection',
                    'module_group_menu',
                    'module_index_menu_modal',
                    'module_index_menu',
                    'module_menu_modal',
                    'module_menu',
                    'wiki_index_menu',
                    'wiki_page_menu',
                    'quiz_index_menu',
                    'quiz_menu',
                    'student_context_card',
                    'submission_type_selection',
                    'post_grades',
                    'tool_configuration',
                    'top_navigation',
                    'user_navigation',
                    /** @deprecated */
                    'resource_selection'
                  ]),

                  /** Custom fields that will be sent to the tool consumer; can be set at the tool-level or within the "placement" JSON object for placement-specific custom fields. When the tool is launched, all custom fields will be sent to the tool as strings. Read more about variable substitutions in custom fields. */
                  custom_fields: z.object().optional(),

                  /** Optional, defaults to `true`. Determines if the placement is enabled. */
                  enabled: z.boolean().optional(),

                  /** The url of the icon to show for this tool. Can be set within the "settings" object for tool-level icons, or in the "placement" object for placement-specific icons. NOTE: Not all placements display an icon. */
                  icon_url: z.url().optional(),

                  /** An object for translations of the "text", used to support internationalization (i18n) / localization (l10n). If the user's Canvas interface is set to one of the languages listed, the tool will display the translated text in place of the value in the "text" field. This JSON object is in the format {"en": "Name", "es": "Nombre"}, where "en" and "es" are IETF language tags. More specific locales ("en-AU") are preferred over less specific ones ("en"). A partial list of language tags can be found here. Can be set within "settings" or individual placements. */
                  labels: z.object().optional(),

                  /** The IMS message type to be sent in the launch. This is set at the placement level. Not all placements support both message_types. */
                  message_type: z
                    .enum(['LtiResourceLinkRequest', 'LtiDeepLinkingRequest'])
                    .optional(),

                  /** Limits tool visibility to users with certain permissions, as defined on the user's built-in Canvas user roles AND the custom roles that you may have created in Canvas. This is a comma-separated string of one or more required permissions, such as manage_groups_add,manage_groups_delete or read_outcomes. The tool will be hidden for users without all specified permissions. If set in placement-specific settings, that placement will be hidden; if set at the tool-level (e.g. under extensions[0]), each of the tool's placements will be hidden. For true access control, please use (instead or in addition) the Canvas.membership.permissions<> custom variable expansion, and check its value in your tool. To learn more about roles and permissions, and to see the permissions available for this parameter, visit the Roles API docs. */
                  required_permissions: z.string().optional(),

                  /** The display height of the iframe. This may be ignored or overridden for some LTI placements due to other UI requirements set by Canvas. Tools are advised to experiment with this setting to see what makes the most sense for their application. */
                  selection_height: z.string().optional(),

                  /** The display width of the iframe. This may be ignored or overridden for some LTI placements due to other UI requirements set by Canvas. Tools are advised to experiment with this setting to see what makes the most sense for their application. */
                  selection_width: z.string().optional(),

                  /** The default text to show for this tool. Can be set within "settings" for the tool-level display text, or within "placements" object for placement-specific display text. */
                  text: z.string().optional()
                }),
                z.object({
                  placement: z.templateLiteral(['file_menu']),

                  /** A comma-separated list of MIME types, e.g.: "image/jpeg,image/png". The LTI tool will be shown in the file_menu placement if the file's MIME type matches one of the MIME types in the list. (Screenshot of the file_menu placement.) */
                  accept_media_types: z.string().optional()
                }),
                z.object({
                  placement: z.enum([
                    'account_navigation',
                    'course_navigation'
                  ]),

                  /** Whether the tool should be shown in the sidebar. */
                  default: z.enum(['enabled', 'disabled']).optional()
                }),
                z.object({
                  placement: z.templateLiteral(['global_navigation']),

                  /** An SVG path to be used for the tool's icon in the global_navigation placement. Note: this should be the SVG path itself, not a URL to an SVG image. The value of this parameter will be used as the d attribute on the SVG's path element. See MDN for more information. */
                  icon_svg_path_64: z.string().optional()
                }),
                z.object({
                  placement: z.templateLiteral(['editor_button']),

                  /** Whether the tool should open in the tray (a.k.a. sidebar) rather than a modal window. True means to use the tray, false means to use a modal window. The tray allows the user to still interact with the page while the tray is open; the modal window blocks the rest of the page while the modal window is open. */
                  use_tray: z.boolean().optional()
                }),
                z.object({
                  placement: z.enum([
                    'account_navigation',
                    'course_navigation',
                    'global_navigation',
                    'user_navigation'
                  ]),

                  /** Whether the tool should be launched in a new tab. */
                  windowTarget: z.enum(['_blank']).optional()
                })
              ])
            )
            .optional(),

          /** Limits tool visibility to users with certain permissions, as defined on the user's built-in Canvas user roles AND the custom roles that you may have created in Canvas. This is a comma-separated string of one or more required permissions, such as manage_groups_add,manage_groups_delete or read_outcomes. The tool will be hidden for users without all specified permissions. If set in placement-specific settings, that placement will be hidden; if set at the tool-level (e.g. under extensions[0]), each of the tool's placements will be hidden. For true access control, please use (instead or in addition) the Canvas.membership.permissions<> custom variable expansion, and check its value in your tool. To learn more about roles and permissions, and to see the permissions available for this parameter, visit the Roles API docs. */
          required_permissions: z.string().optional(),

          /** The display height of the iframe. This may be ignored or overridden for some LTI placements due to other UI requirements set by Canvas. Tools are advised to experiment with this setting to see what makes the most sense for their application. */
          selection_height: z.string().optional(),

          /** The display width of the iframe. This may be ignored or overridden for some LTI placements due to other UI requirements set by Canvas. Tools are advised to experiment with this setting to see what makes the most sense for their application. */
          selection_width: z.string().optional(),

          /** The default text to show for this tool. Can be set within "settings" for the tool-level display text, or within "placements" object for placement-specific display text. */
          text: z.string().optional()
        })
        .optional()
    })
    .optional(),

  /**
   * Required if public_jwk is omitted. The tools public key uri to be used
   * during the client_credentials grant for accessing LTI Advantage services.
   */
  public_jwk_url: z.url().optional(),
  /**
   * Custom fields that will be sent to the tool consumer; can be set at the
   * tool-level or within the "placement" JSON object for placement-specific
   * custom fields. When the tool is launched, all custom fields will be sent
   * to the tool as strings. Read more about variable substitutions in custom
   * fields.
   */
  custom_fields: z.object().optional()
});
